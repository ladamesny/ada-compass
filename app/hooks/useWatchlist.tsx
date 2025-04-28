'use client';

import { useState, useEffect } from 'react';
import { WatchlistToken } from '@/app/types';
import { 
  getWatchlist, 
  saveWatchlist, 
  addToWatchlist as addToLocalStorage,
  removeFromWatchlist as removeFromLocalStorage
} from '@/app/utils/localStorage';
import { searchTokens } from '@/app/services/api';

interface WatchlistState {
  watchlist: WatchlistToken[];
  searchResults: WatchlistToken[];
  isSearching: boolean;
  searchError: string | null;
  addToWatchlist: (token: WatchlistToken) => void;
  removeFromWatchlist: (tokenName: string) => void;
  searchForTokens: (query: string) => Promise<void>;
}

export function useWatchlist(): WatchlistState {
  const [watchlist, setWatchlist] = useState<WatchlistToken[]>([]);
  const [searchResults, setSearchResults] = useState<WatchlistToken[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const storedWatchlist = getWatchlist();
    setWatchlist(storedWatchlist);
  }, []);

  // Add token to watchlist
  const addToWatchlist = (token: WatchlistToken) => {
    const updatedWatchlist = addToLocalStorage({ ...token, inWatchlist: true });
    setWatchlist(updatedWatchlist);
    
    // Also update search results to reflect the change
    setSearchResults(prevResults => 
      prevResults.map(t => 
        t.token_name === token.token_name 
          ? { ...t, inWatchlist: true }
          : t
      )
    );
  };

  // Remove token from watchlist
  const removeFromWatchlist = (tokenName: string) => {
    const updatedWatchlist = removeFromLocalStorage(tokenName);
    setWatchlist(updatedWatchlist);
    
    // Also update search results to reflect the change
    setSearchResults(prevResults => 
      prevResults.map(t => 
        t.token_name === tokenName 
          ? { ...t, inWatchlist: false }
          : t
      )
    );
  };

  // Search for tokens
  const searchForTokens = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const results = await searchTokens(query);
      
      // Mark tokens that are already in the watchlist
      const resultWithWatchlistStatus = results.map(token => ({
        ...token,
        inWatchlist: watchlist.some(w => w.token_name === token.token_name)
      }));
      
      setSearchResults(resultWithWatchlistStatus);
    } catch (err) {
      setSearchError('Error searching for tokens. Please try again.');
      console.error('Token search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    watchlist,
    searchResults,
    isSearching,
    searchError,
    addToWatchlist,
    removeFromWatchlist,
    searchForTokens,
  };
} 