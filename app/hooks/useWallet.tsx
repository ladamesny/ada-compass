'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { formatAddress, getStakeAddress } from '@/app/utils/addressUtils';
import { CardanoWalletInstance } from '@/app/utils/cardanoTypes';

// Flag to detect if we're running in the browser
const isBrowser = typeof window !== 'undefined';

// Interface for wallet functionality
interface WalletInfo {
  name: string;
  icon: string;
  id: string;
}

interface WalletState {
  walletAddress: string;
  stakeAddress: string;
  formattedAddress: string;
  isConnected: boolean;
  availableWallets: WalletInfo[];
  selectedWallet: string | null;
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => void;
  isWalletListOpen: boolean;
  setIsWalletListOpen: (isOpen: boolean) => void;
}

// Create context with default values
const WalletContext = createContext<WalletState>({
  walletAddress: '',
  stakeAddress: '',
  formattedAddress: '',
  isConnected: false,
  availableWallets: [],
  selectedWallet: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isWalletListOpen: false,
  setIsWalletListOpen: () => {},
});

// Wallet provider component
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [stakeAddress, setStakeAddress] = useState<string>('');
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isWalletListOpen, setIsWalletListOpen] = useState<boolean>(false);

  // Update formatted address whenever wallet address changes
  useEffect(() => {
    if (walletAddress) {
      setFormattedAddress(formatAddress(walletAddress));
    } else {
      setFormattedAddress('');
    }
  }, [walletAddress]);

  // Load available wallets on initial render
  useEffect(() => {
    if (!isBrowser) return;
    
    const loadAvailableWallets = async () => {
      try {
        // Use MeshSDK to get wallet info (this was working before)
        const { BrowserWallet } = await import('@meshsdk/core');
        const meshWallets = await BrowserWallet.getInstalledWallets();
        
        const wallets: WalletInfo[] = meshWallets.map(wallet => ({
          id: wallet.name,
          name: wallet.name,
          icon: wallet.icon || '',
        }));
        
        setAvailableWallets(wallets);
        console.log('Available wallets (MeshSDK):', wallets);
      } catch (error) {
        console.error('Error loading available wallets:', error);
      }
    };
    
    loadAvailableWallets();
  }, []);

  // Connect wallet function
  const connectWallet = async (walletId?: string) => {
    if (!isBrowser) return;
    
    try {
      setIsWalletListOpen(false);
      
      if (!walletId && availableWallets.length === 0) {
        alert('No Cardano wallets found. Please install a wallet like Eternl, Nami, or Flint.');
        return;
      }
      
      // If walletId is provided, use it; otherwise show the wallet selector or use the only available wallet
      const selectedWalletId = walletId || (availableWallets.length === 1 ? availableWallets[0].id : null);
      
      if (!selectedWalletId) {
        // If no wallet is selected and there are multiple options, open the wallet list
        setIsWalletListOpen(true);
        return;
      }
      
      // Use MeshSDK only - this was working before
      const { BrowserWallet } = await import('@meshsdk/core');
      const walletInstance = await BrowserWallet.enable(selectedWalletId);
      console.log('Connected to wallet via MeshSDK:', selectedWalletId);
      
      // Get wallet addresses
      const usedAddresses = await walletInstance.getUsedAddresses();
      const address = usedAddresses[0] || '';
      
      console.log('Using wallet address:', address);
      
      // Try to get the stake address - may require additional API calls depending on the wallet
      const derivedStakeAddress = getStakeAddress(address);
      
      // Update state
      setWalletAddress(address);
      setStakeAddress(derivedStakeAddress);
      setIsConnected(true);
      setSelectedWallet(selectedWalletId);
      
      // Save in session storage
      sessionStorage.setItem('walletConnected', 'true');
      sessionStorage.setItem('walletAddress', address);
      sessionStorage.setItem('stakeAddress', derivedStakeAddress);
      sessionStorage.setItem('selectedWallet', selectedWalletId);
      
      // Try to get the real stake address using the wallet API if available
      try {
        // Note: This will only work with wallets that support getRewardAddresses
        const rewardAddresses = await walletInstance.getRewardAddresses?.();
        if (rewardAddresses && rewardAddresses.length > 0) {
          const actualStakeAddress = rewardAddresses[0];
          setStakeAddress(actualStakeAddress);
          sessionStorage.setItem('stakeAddress', actualStakeAddress);
        }
      } catch (error) {
        // This is optional functionality, so we can ignore errors
        console.warn('Could not get stake address from wallet:', error);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWalletAddress('');
    setStakeAddress('');
    setFormattedAddress('');
    setIsConnected(false);
    setSelectedWallet(null);
    
    // Clear session storage
    if (isBrowser) {
      sessionStorage.removeItem('walletConnected');
      sessionStorage.removeItem('walletAddress');
      sessionStorage.removeItem('stakeAddress');
      sessionStorage.removeItem('selectedWallet');
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    if (!isBrowser) return;
    
    const checkExistingConnection = async () => {
      const connected = sessionStorage.getItem('walletConnected') === 'true';
      const address = sessionStorage.getItem('walletAddress');
      const storedStakeAddress = sessionStorage.getItem('stakeAddress');
      const storedSelectedWallet = sessionStorage.getItem('selectedWallet');
      
      if (connected && address && storedSelectedWallet) {
        try {
          // Wait for available wallets to be loaded
          if (availableWallets.length === 0) {
            return; // Will retry when availableWallets loads
          }
          
          // Use MeshSDK for reconnection
          const { BrowserWallet } = await import('@meshsdk/core');
          const walletInstance = await BrowserWallet.enable(storedSelectedWallet);
          
          // Verify the connection by getting the address
          const connectedAddresses = await walletInstance.getUsedAddresses();
          
          // Only proceed if we can confirm wallet is still accessible
          if (connectedAddresses && connectedAddresses.length > 0) {
            console.log('Successfully reconnected to wallet:', storedSelectedWallet);
            setWalletAddress(address);
            setStakeAddress(storedStakeAddress || getStakeAddress(address));
            setIsConnected(true);
            setSelectedWallet(storedSelectedWallet);
          } else {
            throw new Error('Could not verify wallet connection');
          }
        } catch (error) {
          console.error('Error reconnecting wallet:', error);
          // Clear session storage if reconnection fails
          sessionStorage.removeItem('walletConnected');
          sessionStorage.removeItem('walletAddress');
          sessionStorage.removeItem('stakeAddress');
          sessionStorage.removeItem('selectedWallet');
        }
      }
    };
    
    checkExistingConnection();
  }, [availableWallets]);

  // Value to provide through context
  const value = {
    walletAddress,
    stakeAddress,
    formattedAddress,
    isConnected,
    availableWallets,
    selectedWallet,
    connectWallet,
    disconnectWallet,
    isWalletListOpen,
    setIsWalletListOpen,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// Hook to use wallet
export function useWallet() {
  return useContext(WalletContext);
}