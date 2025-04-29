'use client';

import { useState, useEffect } from 'react';
import { getCryptoPrices } from '@/app/services/api';
import { CoinGeckoPrice } from '@/app/types';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CoinGeckoPrice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      const data = await getCryptoPrices();
      setPrices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError('Failed to fetch prices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Set up interval for subsequent fetches
    const intervalId = setInterval(fetchPrices, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return {
    prices,
    isLoading,
    error,
    refreshPrices: fetchPrices
  };
} 