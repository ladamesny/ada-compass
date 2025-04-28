import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components with no SSR
const PortfolioContent = dynamic(
  () => import('../client-components/PortfolioContent').then(mod => mod.PortfolioContent),
  { ssr: false }
);

// Loading component
function PortfolioLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );
}

// Server Component (main page)
export default function Portfolio() {
  return (
    <Suspense fallback={<PortfolioLoading />}>
      <PortfolioContent />
    </Suspense>
  );
} 