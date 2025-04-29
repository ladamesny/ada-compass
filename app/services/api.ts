import axios from 'axios';
import { CoinGeckoPrice, PortfolioData, Token, TradeRecommendation, WatchlistToken } from '@/app/types';
import { fetchPortfolioFromTapTools, getMarketCapData, generateMockPortfolioData } from '@/app/services/taptools';
import { COINGECKO_CONFIG, FEATURES } from '@/app/config/api';

// API URLs
const COINGECKO_API_URL = COINGECKO_CONFIG.API_URL;

// Mock data for development (as TapTools API requires authentication)
const MOCK_DATA = {
  portfolio: {
    fungible_tokens: [
      { token_name: 'ADA', amount: 1000, price: 0.45, change_1d: -2.5, change_7d: 5.0, change_30d: 10.0 },
      { token_name: 'SNEK', amount: 5000, price: 0.02, change_1d: 15.0, change_7d: -10.0, change_30d: 20.0 },
      { token_name: 'HOSKY', amount: 10000, price: 0.001, change_1d: 5.0, change_7d: 8.0, change_30d: 15.0 },
      { token_name: 'MIN', amount: 250, price: 0.15, change_1d: -1.0, change_7d: 3.0, change_30d: -5.0 },
    ],
    nfts: [
      { token_name: 'Clay Nation #123', amount: 1, price: 50, change_1d: 0.0, change_7d: 2.0, change_30d: 5.0 },
      { token_name: 'Space Budz #456', amount: 1, price: 100, change_1d: -5.0, change_7d: -2.0, change_30d: 10.0 },
      { token_name: 'Deadpxlz #789', amount: 1, price: 25, change_1d: 10.0, change_7d: 15.0, change_30d: 20.0 },
    ],
    lp_tokens: [
      { token_name: 'ADA/SNEK LP', amount: 100, price: 10, change_1d: -5.0, change_7d: 3.0, change_30d: 15.0 },
      { token_name: 'ADA/HOSKY LP', amount: 50, price: 5, change_1d: 2.0, change_7d: 5.0, change_30d: 8.0 },
    ],
  },
  tokens: [
    { token_name: 'ADA', price: 0.45, market_cap: 14500000000, change_1d: -2.5 },
    { token_name: 'SNEK', price: 0.02, market_cap: 10000000, change_1d: 15.0 },
    { token_name: 'HOSKY', price: 0.001, market_cap: 5000000, change_1d: 5.0 },
    { token_name: 'MIN', price: 0.15, market_cap: 8000000, change_1d: -1.0 },
    { token_name: 'AGIX', price: 0.55, market_cap: 15000000, change_1d: 2.5 },
    { token_name: 'DJED', price: 1.05, market_cap: 20000000, change_1d: 0.2 },
    { token_name: 'VYFI', price: 0.32, market_cap: 9000000, change_1d: -3.5 },
    { token_name: 'MELD', price: 0.11, market_cap: 7500000, change_1d: 4.5 },
    { token_name: 'WMT', price: 0.28, market_cap: 12000000, change_1d: -1.2 },
    { token_name: 'INDY', price: 0.08, market_cap: 4000000, change_1d: 8.0 },
  ],
};

// Portfolio API
export async function getPortfolioData(walletAddress: string): Promise<PortfolioData> {
  try {
    // Use TapTools API implementation
    console.log(`Fetching portfolio data for address: ${walletAddress}`);
    const data = await fetchPortfolioFromTapTools(walletAddress);
    
    // Log the data to help with debugging
    console.log('Portfolio data received:', data);
    
    // Check if we have any tokens to display
    const hasData = (data.fungible_tokens && data.fungible_tokens.length > 0) || 
                   (data.nfts && data.nfts.length > 0) || 
                   (data.lp_tokens && data.lp_tokens.length > 0);
    
    // Double check that the API actually returned real data, not our mock data
    const isMockData = data.fungible_tokens?.some(t => t.token_name === 'SNEK' && t.amount === 5000);
                   
    if (!hasData || isMockData) {
      console.warn('API returned empty or mock portfolio data. Requesting mock data.');
      // If we don't have any token data, fall back to mock data
      return generateMockPortfolioData();
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    // Fallback to mock data if API fails
    return generateMockPortfolioData();
  }
}

// Token Search API
export async function searchTokens(query: string): Promise<WatchlistToken[]> {
  try {
    if (FEATURES.USE_MOCK_DATA || !query.trim()) {
      // Use mock data in development or if query is empty
      return MOCK_DATA.tokens.map(token => ({
        ...token,
        amount: 0,
        change_7d: 0,
        change_30d: 0,
        inWatchlist: false
      }));
    }

    // Try to get data from the marketCap API
    try {
      const marketCapTokens = await getMarketCapData();
      
      // Filter by query and convert to WatchlistToken format
      const filteredTokens = marketCapTokens
        .filter(token => 
          token.name.toLowerCase().includes(query.toLowerCase()) || 
          token.ticker.toLowerCase().includes(query.toLowerCase())
        )
        .map(token => ({
          token_name: token.name,
          ticker: token.ticker,
          amount: 0,
          price: token.price,
          market_cap: token.marketCap,
          change_1d: (token['24h'] || 0) * 100,
          change_7d: (token['7d'] || 0) * 100,
          change_30d: (token['30d'] || 0) * 100,
          inWatchlist: false
        }));
      
      return filteredTokens;
    } catch (err) {
      console.warn('Error fetching from market cap API, using mock data:', err);
      // Fall back to mock data if the API call fails
      return MOCK_DATA.tokens
        .filter(token => token.token_name.toLowerCase().includes(query.toLowerCase()))
        .map(token => ({
          ...token,
          amount: 0,
          change_7d: 0,
          change_30d: 0,
          inWatchlist: false
        }));
    }
  } catch (error) {
    console.error('Error searching tokens:', error);
    // Return filtered mock data
    return MOCK_DATA.tokens
      .filter(token => token.token_name.toLowerCase().includes(query.toLowerCase()))
      .map(token => ({
        ...token,
        amount: 0,
        change_7d: 0,
        change_30d: 0,
        inWatchlist: false
      }));
  }
}

// CoinGecko Price API
export async function getCryptoPrices(): Promise<CoinGeckoPrice> {
  try {
    // Construct request URL with API key if available
    let url = `${COINGECKO_API_URL}/simple/price?ids=bitcoin,cardano&vs_currencies=usd&include_24hr_change=true`;
    if (COINGECKO_CONFIG.API_KEY) {
      url += `&x_cg_pro_api_key=${COINGECKO_CONFIG.API_KEY}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    // Return mock data if API fails
    return {
      bitcoin: { usd: 95000, usd_24h_change: 2.5 },
      cardano: { usd: 0.72, usd_24h_change: -1.2 }
    };
  }
}

// Generate trade recommendations based on price changes
export function getTradeRecommendations(
  portfolioData: PortfolioData,
  watchlistTokens: WatchlistToken[],
  threshold: number
): TradeRecommendation[] {
  const recommendations: TradeRecommendation[] = [];
  
  // Process portfolio tokens
  const allPortfolioTokens = [
    ...portfolioData.fungible_tokens,
    ...portfolioData.nfts,
    ...portfolioData.lp_tokens
  ];
  
  // Process both portfolio and watchlist tokens
  [...allPortfolioTokens, ...watchlistTokens].forEach(token => {
    const change = token.change_1d;
    
    // Skip if change doesn't meet threshold
    if (Math.abs(change) < threshold) return;
    
    // Calculate previous price based on current price and 1-day change
    const previousPrice = token.price / (1 + change / 100);
    
    recommendations.push({
      token_name: token.token_name,
      action: change > 0 ? 'sell' : 'buy',
      current_price: token.price,
      previous_price: previousPrice,
      percentage_change: change
    });
  });
  
  return recommendations;
} 