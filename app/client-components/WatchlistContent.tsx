'use client';

import { WatchlistTable } from '@/app/components/watchlist/WatchlistTable';
import { WatchlistSearch } from '@/app/components/watchlist/WatchlistSearch';

// Client-side Watchlist component
export function WatchlistContent() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Token Watchlist</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Search and track Cardano native tokens to stay informed about price movements.
        </p>
      </div>

      <div className="space-y-8">
        <WatchlistTable />
        <WatchlistSearch />
      </div>
    </div>
  );
} 