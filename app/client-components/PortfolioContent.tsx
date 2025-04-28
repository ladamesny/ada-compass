'use client';

import { usePortfolio } from '@/app/hooks/usePortfolio';
import { useWallet } from '@/app/hooks/useWallet';
import { Button } from '@/app/components/ui/Button';
import { PortfolioSummary } from '@/app/components/portfolio/PortfolioSummary';
import { TokenTable } from '@/app/components/portfolio/TokenTable';
import { Tabs } from '@/app/components/ui/Tabs';
import { Card } from '@/app/components/ui/Card';
import { PrivacyProvider, usePrivacy } from '@/app/contexts/PrivacyContext';
import { PrivacyToggle } from '@/app/components/ui/PrivacyToggle';

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

// Portfolio Header component
function PortfolioHeader({ onRefresh }: { onRefresh: () => void }) {
  const { isPrivate } = usePrivacy();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Your Portfolio</h1>
        <div className="flex items-center gap-2">
          <PrivacyToggle />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isPrivate ? 'Click to show balances' : 'Click to hide balances'}
          </span>
        </div>
      </div>
      <Button onClick={onRefresh} variant="outline" size="sm">
        Refresh
      </Button>
    </div>
  );
}

// Client-side Portfolio component
export function PortfolioContent() {
  const { portfolioData, isLoading, error, refreshData } = usePortfolio();
  const { isConnected, connectWallet } = useWallet();

  const handleConnectWallet = () => {
    connectWallet();
  };

  console.log("PORTFOLIO DATA: ", portfolioData)

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Connect your Cardano wallet to view your portfolio, track your tokens, and get personalized trade recommendations.
        </p>
        <Button onClick={handleConnectWallet} variant="primary" size="lg">
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">Error Loading Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Button onClick={refreshData} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading || !portfolioData) {
    return <PortfolioLoading />;
  }

  // Portfolio tabs configuration
  const portfolioTabs = [
    {
      label: `Fungible Tokens (${portfolioData.fungible_tokens.length})`,
      content: <TokenTable tokens={portfolioData.fungible_tokens} title="Fungible Tokens" />
    },
    {
      label: `NFTs (${portfolioData.nfts.length})`,
      content: <TokenTable tokens={portfolioData.nfts} title="NFTs" />
    },
    {
      label: `LP Tokens (${portfolioData.lp_tokens.length})`,
      content: <TokenTable tokens={portfolioData.lp_tokens} title="LP Tokens" />
    }
  ];

  return (
    <PrivacyProvider>
      <div>
        <PortfolioHeader onRefresh={refreshData} />
        <PortfolioSummary />

        {/* Token Tables in Tabs */}
        <div className="mt-6">
          <Card>
            <div className="px-6 py-4">
              <Tabs tabs={portfolioTabs} />
            </div>
          </Card>
        </div>
      </div>
    </PrivacyProvider>
  );
} 