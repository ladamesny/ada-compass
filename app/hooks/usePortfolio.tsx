'use client';

import { useState, useEffect } from 'react';
import { getCryptoPrices, getPortfolioData } from '@/app/services/api';
import { PortfolioData, CoinGeckoPrice, Token } from '@/app/types';
import { useWallet } from './useWallet';

interface PortfolioState {
  portfolioData: PortfolioData | null;
  cryptoPrices: CoinGeckoPrice | null;
  isLoading: boolean;
  error: string | null;
  totalBalanceADA: number;
  totalBalanceUSD: number;
  refreshData: () => Promise<void>;
}

export function usePortfolio(): PortfolioState {
  const { walletAddress, stakeAddress, isConnected } = useWallet();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CoinGeckoPrice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalanceADA, setTotalBalanceADA] = useState<number>(0);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);

  // Calculate total balances
  useEffect(() => {
    if (portfolioData && cryptoPrices) {
      // If portfolio data already has total value, use it
      // Otherwise calculate it from the token data
      let totalADA = portfolioData.total_ada_value || 0;
      
      if (!portfolioData.total_ada_value) {
        // Sum up values from fungible tokens
        portfolioData.fungible_tokens.forEach((token: Token) => {
          totalADA += token.amount * token.price;
        });
        
        // Sum up values from NFTs
        portfolioData.nfts.forEach((token: Token) => {
          totalADA += token.amount * token.price;
        });
        
        // Sum up values from LP tokens
        portfolioData.lp_tokens.forEach((token: Token) => {
          totalADA += token.amount * token.price;
        });
      }
      
      // Set total ADA balance
      setTotalBalanceADA(totalADA);
      
      // Convert to USD using ADA price from CoinGecko
      if (cryptoPrices.cardano && cryptoPrices.cardano.usd) {
        setTotalBalanceUSD(totalADA * cryptoPrices.cardano.usd);
      }
    }
  }, [portfolioData, cryptoPrices]);

  // Fetch portfolio data
  const fetchData = async () => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use stake address for TapTools API if available, otherwise use wallet address
      const addressToUse = stakeAddress || walletAddress;
      
      // Fetch portfolio data from wallet
      const portfolio = await getPortfolioData(addressToUse);
      setPortfolioData(portfolio);
      
      // Fetch crypto prices
      const prices = await getCryptoPrices();
      setCryptoPrices(prices);
    } catch (err) {
      setError('Failed to fetch portfolio data. Please try again.');
      console.error('Portfolio data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Only fetch when wallet is connected and we have an address
    if (isConnected && (walletAddress || stakeAddress)) {
      console.log("FETCHING DATA")
      console.log("WALLET ADDRESS: ", walletAddress)
      fetchData();
    }
  }, [walletAddress, stakeAddress, isConnected]);

  // Return the portfolio state
  return {
    portfolioData,
    cryptoPrices,
    isLoading,
    error,
    totalBalanceADA,
    totalBalanceUSD,
    refreshData: fetchData,
  };
} 