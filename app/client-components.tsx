'use client';

/**
 * This file serves as a central export point for client components that need 
 * to be explicitly marked as client-side only.
 */

// Export client-side hooks and components that use browser APIs
export { WalletProvider } from '@/app/hooks/useWallet';
export { useWallet } from '@/app/hooks/useWallet';
export { ThemeProvider } from '@/app/hooks/useTheme';
export { useTheme } from '@/app/hooks/useTheme';

// Re-export client components from here
export { PortfolioSummary } from '@/app/components/portfolio/PortfolioSummary';
export { TokenTable } from '@/app/components/portfolio/TokenTable';
export { WatchlistTable } from '@/app/components/watchlist/WatchlistTable';
export { WatchlistSearch } from '@/app/components/watchlist/WatchlistSearch';
export { TradeRecommendations } from '@/app/components/trades/TradeRecommendations';
export { usePortfolio } from '@/app/hooks/usePortfolio';
export { useWatchlist } from '@/app/hooks/useWatchlist';
export { useTrades } from '@/app/hooks/useTrades';
export { Button } from '@/app/components/ui/Button'; 