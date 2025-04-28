'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getThemePreference, saveThemePreference } from '@/app/utils/localStorage';
import { ThemeState } from '@/app/types';

// Create context with default values
const ThemeContext = createContext<ThemeState>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = getThemePreference();
    console.log('Initializing theme from localStorage:', savedTheme);
    setIsDarkMode(savedTheme);
    setIsInitialized(true);
  }, []);

  // Update document classes when theme changes
  useEffect(() => {
    if (!isInitialized) return;

    console.log('Theme changed, updating document classes:', isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    console.log('Saving theme preference to localStorage:', isDarkMode);
    saveThemePreference(isDarkMode);
  }, [isDarkMode, isInitialized]);

  // Toggle function
  const toggleDarkMode = () => {
    console.log('Toggling theme from', isDarkMode, 'to', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  // Value to provide through context
  const value = {
    isDarkMode,
    toggleDarkMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
} 