// Wallet and Portfolio Types
export interface Token {
  token_name: string;
  amount: number;
  price: number;
  change_1d: number;
  change_7d: number;
  change_30d: number;
  // LP token specific fields (optional)
  token_a?: string;
  token_a_amount?: number;
  token_b?: string;
  token_b_amount?: number;
  // NFT specific fields (optional)
  floor_price?: number;
  listings?: number;
  policy_id?: string;
}

export interface PortfolioData {
  fungible_tokens: Token[];
  nfts: Token[];
  lp_tokens: Token[];
  // Overall portfolio value (optional)
  total_ada_value?: number;
  total_liquid_value?: number;
}

export interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

// Watchlist Types
export interface WatchlistToken extends Token {
  market_cap?: number;
  inWatchlist: boolean;
}

// Trade Recommendation Types
export interface TradeRecommendation {
  token_name: string;
  action: 'buy' | 'sell';
  current_price: number;
  previous_price: number;
  percentage_change: number;
}

// UI Types
export interface NavItem {
  name: string;
  href: string;
}

export interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
} 