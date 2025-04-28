'use client';

import { useState } from 'react';
import { usePortfolio } from '@/app/hooks/usePortfolio';

export function MarketPrices() {
  const [isOpen, setIsOpen] = useState(false);
  const { cryptoPrices } = usePortfolio();

  return (
    <div className="w-full border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 flex items-center justify-between text-2xl font-bold text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
        >
          <span>Market Prices</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="py-3 space-y-3 bg-gray-50 dark:bg-gray-800/50">
            {/* BTC Price */}
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-orange-500 p-2 rounded-full mr-3">
                  <span className="text-white font-bold">₿</span>
                </div>
                <span className="font-medium">Bitcoin</span>
              </div>
              <div className="text-lg font-bold">
                ${cryptoPrices?.bitcoin?.usd.toLocaleString() || '0'}
              </div>
            </div>
            
            {/* ADA Price */}
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-cardano-blue p-2 rounded-full mr-3">
                  <span className="text-white font-bold">₳</span>
                </div>
                <span className="font-medium">Cardano</span>
              </div>
              <div className="text-lg font-bold">
                ${cryptoPrices?.cardano?.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '0'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 