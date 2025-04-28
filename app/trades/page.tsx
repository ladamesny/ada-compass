import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components with no SSR
const TradesContent = dynamic(
  () => import('../client-components/TradesContent').then(mod => mod.TradesContent),
  { ssr: false }
);

// Loading component
function TradesLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );
}

// Server Component (main page)
export default function Trades() {
  return (
    <Suspense fallback={<TradesLoading />}>
      <TradesContent />
    </Suspense>
  );
} 