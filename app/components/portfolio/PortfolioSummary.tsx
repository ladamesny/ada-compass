'use client';

import { usePortfolio } from '@/app/hooks/usePortfolio';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioSummary() {
  const { portfolioData, cryptoPrices, totalBalanceADA, totalBalanceUSD, isLoading } = usePortfolio();

  // Use API total values if available, otherwise use calculated ones
  const displayTotalADA = portfolioData?.total_ada_value || totalBalanceADA;

  // Calculate token value totals for chart
  const fungibleTotal = portfolioData?.fungible_tokens.reduce((sum, token) => sum + token.amount * token.price, 0) || 0;
  const nftTotal = portfolioData?.nfts.reduce((sum, token) => sum + token.amount * token.price, 0) || 0;
  const lpTotal = portfolioData?.lp_tokens.reduce((sum, token) => sum + token.amount * token.price, 0) || 0;

  // Chart data
  const chartData = {
    labels: ['Fungible Tokens', 'NFTs', 'LP Tokens'],
    datasets: [
      {
        data: [fungibleTotal, nftTotal, lpTotal],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center items-center h-60">
            <div className="animate-pulse text-primary-500">Loading portfolio data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crypto Prices */}
          <div className="order-2 md:order-1">
            <h3 className="text-lg font-semibold mb-4">Market Prices</h3>
            
            <div className="flex flex-col space-y-4">
              {/* BTC Price */}
              <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
              <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
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
            
            {/* Total Balance */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Total Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ADA</div>
                  <div className="text-lg font-bold mt-1">₳{displayTotalADA.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">USD</div>
                  <div className="text-lg font-bold mt-1">${totalBalanceUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              
              {/* Token Type Breakdown */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900">
                  <div className="text-xs text-blue-700 dark:text-blue-300">Fungible</div>
                  <div className="font-medium">₳{fungibleTotal.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
                <div className="p-2 rounded bg-pink-100 dark:bg-pink-900">
                  <div className="text-xs text-pink-700 dark:text-pink-300">NFTs</div>
                  <div className="font-medium">₳{nftTotal.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
                <div className="p-2 rounded bg-teal-100 dark:bg-teal-900">
                  <div className="text-xs text-teal-700 dark:text-teal-300">LP</div>
                  <div className="font-medium">₳{lpTotal.toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Chart */}
          <div className="order-1 md:order-2 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
            <div className="w-full max-w-xs">
              <Pie data={chartData} options={chartOptions} />
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
              <div className="text-lg font-bold mt-1">₳{displayTotalADA.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 