'use client';

import { TradeRecommendations } from '@/app/components/trades/TradeRecommendations';

// Client-side Trades component
export function TradesContent() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trade Recommendations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get personalized trading recommendations based on token price movements.
        </p>
      </div>

      <TradeRecommendations />
    </div>
  );
} 