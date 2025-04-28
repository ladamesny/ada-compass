'use client';

import Link from 'next/link';
import { useTheme, useWallet } from '@/app/client-components';
import { Button } from '@/app/components/ui/Button';
import { WalletSelector } from '@/app/components/layout/WalletSelector';
import { MarketPrices } from '@/app/components/layout/MarketPrices';

// Navigation items
const navItems = [
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Watchlist', href: '/watchlist' },
  { name: 'Trades', href: '/trades' },
];

export function Header() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isConnected, formattedAddress, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/75 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/75">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/portfolio" className="text-xl font-bold text-cardano-blue dark:text-cardano-teal">
            ADA Compass
          </Link>
          <nav className="ml-10 hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          {/* Theme toggle button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
          
          {/* Wallet selector component */}
          <WalletSelector />
        </div>
      </div>
      
      {/* Mobile navigation - shows only on small screens */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <nav className="flex justify-between px-4 py-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Market Prices Section */}
      <MarketPrices />
    </header>
  );
} 