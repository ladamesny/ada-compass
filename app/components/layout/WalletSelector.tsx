'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@/app/client-components';
import { Button } from '@/app/components/ui/Button';

export function WalletSelector() {
  const { 
    isConnected, 
    connectWallet, 
    disconnectWallet,
    availableWallets,
    isWalletListOpen,
    setIsWalletListOpen,
    formattedAddress
  } = useWallet();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWalletListOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsWalletListOpen]);

  // If connected, show disconnect button
  if (isConnected) {
    return (
      <div className="relative">
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <span className="mr-2">{formattedAddress}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => {
          if (availableWallets.length === 1) {
            connectWallet(availableWallets[0].id);
          } else {
            setIsWalletListOpen(!isWalletListOpen);
          }
        }}
        variant="primary"
        size="sm"
        className="flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
        Connect Wallet
      </Button>

      {isWalletListOpen && availableWallets.length > 0 && (
        <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Wallet</h3>
          </div>
          <ul className="max-h-60 overflow-y-auto py-2">
            {availableWallets.map((wallet) => (
              <li key={wallet.id} className="px-3">
                <button
                  onClick={() => connectWallet(wallet.id)}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  {wallet.icon ? (
                    <img 
                      src={wallet.icon} 
                      alt={`${wallet.name} icon`} 
                      className="w-5 h-5 mr-3" 
                      onError={(e) => {
                        // If image fails to load, replace with wallet emoji
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 14h.01"/><path d="M2 10h20"/></svg>';
                      }}
                    />
                  ) : (
                    <span className="inline-block w-5 h-5 mr-3 text-center">💳</span>
                  )}
                  {wallet.name}
                </button>
              </li>
            ))}
          </ul>
          {availableWallets.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No Cardano wallets detected. Please install a wallet extension like Eternl, Nami, or Flint.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 