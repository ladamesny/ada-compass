'use client';

// Helper function to render price change with colors
export function PriceChange({ change }: { change: number }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const colorClass = isPositive
    ? 'text-green-600 dark:text-green-400'
    : isNeutral
    ? 'text-gray-500 dark:text-gray-400'
    : 'text-red-600 dark:text-red-400';
    
  const sign = isPositive ? '+' : '';
  
  return (
    <span className={colorClass}>
      {sign}{change.toFixed(2)}%
    </span>
  );
} 