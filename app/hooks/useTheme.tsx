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

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setIsDarkMode(getThemePreference());
  }, []);

  // Update document classes when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemePreference(isDarkMode);
  }, [isDarkMode]);

  // Toggle function
  const toggleDarkMode = () => {
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