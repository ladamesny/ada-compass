import { WatchlistToken } from '@/app/types';

// Constants for localStorage keys
const WATCHLIST_KEY = 'ada-compass-watchlist';
const THEME_KEY = 'ada-compass-theme';
const THRESHOLD_KEY = 'ada-compass-threshold';

// Watchlist functions
export const getWatchlist = (): WatchlistToken[] => {
  if (typeof window === 'undefined') return [];
  
  const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
  return savedWatchlist ? JSON.parse(savedWatchlist) : [];
};

export const saveWatchlist = (watchlist: WatchlistToken[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
};

export const addToWatchlist = (token: WatchlistToken): WatchlistToken[] => {
  const currentWatchlist = getWatchlist();
  
  // Check if token already exists in watchlist
  if (!currentWatchlist.some(t => t.token_name === token.token_name)) {
    const updatedWatchlist = [...currentWatchlist, { ...token, inWatchlist: true }];
    saveWatchlist(updatedWatchlist);
    return updatedWatchlist;
  }
  
  return currentWatchlist;
};

export const removeFromWatchlist = (tokenName: string): WatchlistToken[] => {
  const currentWatchlist = getWatchlist();
  const updatedWatchlist = currentWatchlist.filter(token => token.token_name !== tokenName);
  saveWatchlist(updatedWatchlist);
  return updatedWatchlist;
};

// Theme functions
export const getThemePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  
  // Default to system preference if available
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  
  return false;
};

export const saveThemePreference = (isDarkMode: boolean): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
};

// Threshold functions
export const getThreshold = (): number => {
  if (typeof window === 'undefined') return 20;
  
  const savedThreshold = localStorage.getItem(THRESHOLD_KEY);
  return savedThreshold ? parseInt(savedThreshold, 10) : 20;
};

export const saveThreshold = (threshold: number): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THRESHOLD_KEY, threshold.toString());
}; 