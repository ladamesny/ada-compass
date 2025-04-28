'use client';

import { useState, useEffect } from 'react';
import { TradeRecommendation } from '@/app/types';
import { getTradeRecommendations } from '@/app/services/api';
import { getThreshold, saveThreshold } from '@/app/utils/localStorage';
import { usePortfolio } from './usePortfolio';
import { useWatchlist } from './useWatchlist';

interface TradesState {
  recommendations: TradeRecommendation[];
  threshold: number;
  isLoading: boolean;
  updateThreshold: (newThreshold: number) => void;
  refreshRecommendations: () => void;
}

export function useTrades(): TradesState {
  const { portfolioData } = usePortfolio();
  const { watchlist } = useWatchlist();
  const [recommendations, setRecommendations] = useState<TradeRecommendation[]>([]);
  const [threshold, setThreshold] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load threshold from localStorage on mount
  useEffect(() => {
    const savedThreshold = getThreshold();
    setThreshold(savedThreshold);
  }, []);

  // Generate recommendations when portfolio, watchlist or threshold changes
  useEffect(() => {
    if (!portfolioData) return;
    
    setIsLoading(true);
    
    try {
      const trades = getTradeRecommendations(portfolioData, watchlist, threshold);
      setRecommendations(trades);
    } catch (err) {
      console.error('Error generating trade recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [portfolioData, watchlist, threshold]);

  // Update threshold
  const updateThreshold = (newThreshold: number) => {
    // Ensure threshold is within range
    const validThreshold = Math.min(Math.max(1, newThreshold), 100);
    setThreshold(validThreshold);
    saveThreshold(validThreshold);
  };

  // Manual refresh
  const refreshRecommendations = () => {
    if (!portfolioData) return;
    
    setIsLoading(true);
    
    try {
      const trades = getTradeRecommendations(portfolioData, watchlist, threshold);
      setRecommendations(trades);
    } catch (err) {
      console.error('Error generating trade recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendations,
    threshold,
    isLoading,
    updateThreshold,
    refreshRecommendations,
  };
} 