'use client';

import { useWallet } from '@/app/hooks/useWallet';
import { useCryptoPrices } from '@/app/hooks/useCryptoPrices';

export function MarketPrices() {
  const { isConnected } = useWallet();
  const { prices: cryptoPrices, isLoading } = useCryptoPrices();

  if (!isConnected) return null;

  const formatPriceChange = (change: number | undefined) => {
    if (change === undefined) return null;
    const formattedChange = change.toFixed(2);
    const isPositive = change > 0;
    return (
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{formattedChange}%
      </span>
    );
  };

  return (
    <div className="w-full border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end space-x-8 py-2">
          {/* BTC Price */}
          <div className="flex items-center">
            <div className="bg-orange-500 p-2 rounded-full mr-3">
              <span className="text-white font-bold">₿</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Bitcoin</div>
              <div className="font-bold">
                ${cryptoPrices?.bitcoin?.usd.toLocaleString() || '0'}
              </div>
              {formatPriceChange(cryptoPrices?.bitcoin?.usd_24h_change)}
            </div>
          </div>
          
          {/* ADA Price */}
          <div className="flex items-center">
            <div className="bg-cardano-blue p-2 rounded-full mr-3">
              <span className="text-white font-bold">₳</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Cardano</div>
              <div className="font-bold">
                ${cryptoPrices?.cardano?.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '0'}
              </div>
              {formatPriceChange(cryptoPrices?.cardano?.usd_24h_change)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 