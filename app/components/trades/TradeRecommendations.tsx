'use client';

import { useState } from 'react';
import { useTrades } from '@/app/hooks/useTrades';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { PriceChange } from '@/app/components/watchlist/PriceChange';

export function TradeRecommendations() {
  const { recommendations, threshold, isLoading, updateThreshold, refreshRecommendations } = useTrades();
  const [thresholdInput, setThresholdInput] = useState(threshold.toString());

  // Handle threshold update
  const handleUpdateThreshold = () => {
    const newThreshold = parseInt(thresholdInput, 10);
    if (!isNaN(newThreshold) && newThreshold >= 1 && newThreshold <= 100) {
      updateThreshold(newThreshold);
    } else {
      setThresholdInput(threshold.toString());
    }
  };

  // Recommendations exist check
  const hasRecommendations = recommendations.length > 0;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Trade Recommendations</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Set the price change threshold for buy/sell recommendations. We recommend selling tokens if 
            the price increases by ≥{threshold}% or buying if the price drops by ≥{threshold}%.
          </p>
          
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              label="Threshold (%)"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              min={1}
              max={100}
              className="w-32"
            />
            <Button 
              variant="secondary" 
              onClick={handleUpdateThreshold}
              disabled={parseInt(thresholdInput, 10) === threshold}
            >
              Update
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshRecommendations}
              disabled={isLoading}
              className="ml-2"
            >
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Loading recommendations...</div>
          </div>
        ) : !hasRecommendations ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No trade recommendations found with the current threshold ({threshold}%).
            <p className="mt-2">Try lowering the threshold or check back later for price movements.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Previous Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recommendations.map((recommendation, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{recommendation.token_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        recommendation.action === 'buy' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {recommendation.action === 'buy' ? 'Buy' : 'Sell'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      ₳{recommendation.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      ₳{recommendation.previous_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriceChange change={recommendation.percentage_change} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 