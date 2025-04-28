import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components with no SSR
const WatchlistContent = dynamic(
  () => import('../client-components/WatchlistContent').then(mod => mod.WatchlistContent),
  { ssr: false }
);

// Loading component
function WatchlistLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );
}

// Server Component (main page)
export default function Watchlist() {
  return (
    <Suspense fallback={<WatchlistLoading />}>
      <WatchlistContent />
    </Suspense>
  );
} 