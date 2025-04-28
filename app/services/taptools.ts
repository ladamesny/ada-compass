import axios from 'axios';
import { PortfolioData, Token } from '@/app/types';
import { TAPTOOLS_CONFIG } from '@/app/config/api';

// TapTools API constants (matching Rust implementation)
const PORTFOLIO_API_HOST = TAPTOOLS_CONFIG.API_URL;
const WALLET_POSITIONS_URL = "/wallet/portfolio/positions";
const MARKET_CAP_URL = "/token/top/mcap";

// API Key for TapTools
const API_KEY = TAPTOOLS_CONFIG.API_KEY;

// More detailed portfolio API response types (matching Rust models)
export interface FtPosition {
  balance: number;
  liquidBalance: number;
  adaValue: number;
  liquidValue: number;
  price?: number;
  ticker: string;
  unit: string;
  fingerprint: string;
  "24h"?: number; 
  "7d"?: number; 
  "30d"?: number; 
}

export interface NftPosition {
  balance: number;
  adaValue: number;
  liquidValue: number;
  floorPrice: number;
  listings: number;
  name: string;
  policy: string;
  "24h"?: number;
  "7d"?: number;
  "30d"?: number;
}

export interface LpPosition {
  amount_lp: number;
  ada_value: number;
  liquid_value: number;
  ticker: string;
  exchange: string;
  unit: string;
  tokenA: string;
  tokenAAmount: number;
  tokenAName: string;
  tokenB: string;
  tokenBAmount: number;
  tokenBName: string;
}

export interface MarketCapToken {
  ticker: string;
  fingerprint: string;
  name: string;
  price: number;
  marketCap: number;
  "24h"?: number;
  "7d"?: number;
  "30d"?: number;
}

export interface TapToolsPortfolioResponse {
  ftPositions: FtPosition[];
  nftPositions: NftPosition[];
  lpPositions: LpPosition[];
  positions_value: number;
  liquid_value: number;
}

/**
 * Make a portfolio API request - similar to the Rust implementation
 */
async function makePortfolioApiRequest(address: string): Promise<any> {
  try {
    if (!API_KEY) {
      throw new Error('No TapTools API key provided');
    }

    // First try with positions endpoint (matching Rust code)
    try {
      const url = `${PORTFOLIO_API_HOST}${WALLET_POSITIONS_URL}?address=${address}`;
      console.log('Attempting API request to:', url);
      
      const response = await axios.get(url, {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn('Error with positions endpoint, trying portfolio endpoint:', err);
    }
    
    // Try the alternative portfolio endpoint
    const altUrl = `${PORTFOLIO_API_HOST}/wallets/${address}/portfolio`;
    console.log('Attempting API request to alternate endpoint:', altUrl);
    
    const response = await axios.get(altUrl, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error making TapTools API request:', error);
    throw error;
  }
}

/**
 * Get market cap data - similar to the Rust implementation
 */
export async function getMarketCapData(): Promise<MarketCapToken[]> {
  try {
    if (!API_KEY) {
      throw new Error('No TapTools API key provided');
    }

    const url = `${PORTFOLIO_API_HOST}${MARKET_CAP_URL}`;
    
    const response = await axios.get(url, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching market cap data:', error);
    return [];
  }
}

/**
 * Fetch portfolio data from TapTools API
 * @param walletAddress Wallet address or stake address
 * @returns Portfolio data formatted to our app's data structure
 */
export async function fetchPortfolioFromTapTools(walletAddress: string): Promise<PortfolioData> {
  try {
    // Check if we have an API key
    if (!API_KEY) {
      console.warn('No TapTools API key provided. Using mock data.');
      return generateMockPortfolioData();
    }

    console.log('Making API request to TapTools for address:', walletAddress);
    
    // Make API request using the function similar to Rust implementation
    const data = await makePortfolioApiRequest(walletAddress);

    // Parse the response
    return parseTapToolsResponse(data);
  } catch (error) {
    console.error('Error fetching portfolio from TapTools:', error);
    // In case of error, return mock data so the UI doesn't break
    return generateMockPortfolioData();
  }
}

/**
 * Parse TapTools API response into our app's data structure
 */
function parseTapToolsResponse(data: any): PortfolioData {
  console.log("TapTools API Response:", data);
  
  // Create containers for different token types
  const fungible_tokens: Token[] = [];
  const nfts: Token[] = [];
  const lp_tokens: Token[] = [];

  // Check if response has expected structure
  if (!data) {
    console.warn("TapTools API returned empty data");
    return { fungible_tokens, nfts, lp_tokens };
  }

  let total_ada_value = 0;
  let total_liquid_value = 0;

  // Structure 1: Portfolio/positions endpoint with explicit token type arrays
  if (data.ftPositions || data.nftPositions || data.lpPositions) {
    console.log("Processing API response structure with position arrays");
    
    // Track total values if provided
    total_ada_value = data.positions_value || data.total_value || 0;
    total_liquid_value = data.liquid_value || data.liquidValue || 0;

    // Add ADA to fungible tokens if it exists
    const ftPositions = data.ftPositions || [];
    const adaPosition = ftPositions.find((ft: any) => ft?.ticker === 'ADA');
    
    // If ADA isn't in the response, we'll add a placeholder
    if (!adaPosition) {
      fungible_tokens.push({
        token_name: 'ADA',
        amount: 0,
        price: 1.0,
        change_1d: 0,
        change_7d: 0,
        change_30d: 0,
      });
    }

    // Process fungible tokens
    (data.ftPositions || []).forEach((position: any) => {
      if (!position) return;
      
      // Skip duplicating ADA if we've already added it as a placeholder
      if (!adaPosition && position.ticker === 'ADA') return;
      
      // Special handling for ADA - always set its price to 1.0
      const price = position.ticker === 'ADA' ? 1.0 : (position.price || 0);
      
      fungible_tokens.push({
        token_name: position.ticker || 'Unknown Token',
        amount: position.balance || 0,
        price: price,
        change_1d: ((position['24h'] || 0) * 100), // Convert from decimal to percentage
        change_7d: ((position['7d'] || 0) * 100),
        change_30d: ((position['30d'] || 0) * 100),
      });
    });

    // Process NFTs
    (data.nftPositions || []).forEach((position: any) => {
      if (!position) return;
      nfts.push({
        token_name: position.name || 'Unknown NFT',
        amount: position.balance || 1,
        price: position.floorPrice || 0,
        change_1d: ((position['24h'] || 0) * 100),
        change_7d: ((position['7d'] || 0) * 100),
        change_30d: ((position['30d'] || 0) * 100),
        floor_price: position.floorPrice || 0,
        listings: position.listings || 0,
        policy_id: position.policy || '',
      });
    });

    // Process LP tokens
    (data.lpPositions || []).forEach((position: any) => {
      if (!position) return;
      lp_tokens.push({
        token_name: `${position.exchange || 'Unknown'} ${position.ticker || 'LP'}`,
        amount: position.amount_lp || 0,
        price: (position.ada_value && position.amount_lp) ? (position.ada_value / position.amount_lp) : 0,
        change_1d: 0, // LP tokens typically don't have price change data
        change_7d: 0,
        change_30d: 0,
        // Additional LP-specific data that can be used in UI
        token_a: position.tokenAName || position.tokenA,
        token_a_amount: position.tokenAAmount || 0,
        token_b: position.tokenBName || position.tokenB,
        token_b_amount: position.tokenBAmount || 0,
      });
    });
  }
  // Structure 2: positionsFt, positionsNft, positionsLp structure (from user's example)
  else if (data.positionsFt || data.positionsNft || data.positionsLp) {
    console.log("Processing API response structure with positionsFt/positionsNft/positionsLp arrays");
    
    // Track total values if provided
    total_ada_value = data.adaValue || 0;
    total_liquid_value = data.liquidValue || 0;

    // Process fungible tokens
    (data.positionsFt || []).forEach((position: any) => {
      if (!position) return;
      
      // Special handling for ADA - always set its price to 1.0
      const price = position.ticker === 'ADA' ? 1.0 : (position.price || 0);
      
      fungible_tokens.push({
        token_name: position.ticker || 'Unknown Token',
        amount: position.balance || 0,
        price: price,
        change_1d: ((position['24h'] || 0) * 100), // Convert from decimal to percentage
        change_7d: ((position['7d'] || 0) * 100),
        change_30d: ((position['30d'] || 0) * 100),
      });
    });

    // Process NFTs
    (data.positionsNft || []).forEach((position: any) => {
      if (!position) return;
      nfts.push({
        token_name: position.name || 'Unknown NFT',
        amount: position.balance || 1,
        price: position.floorPrice || 0,
        change_1d: ((position['24h'] || 0) * 100),
        change_7d: ((position['7d'] || 0) * 100),
        change_30d: ((position['30d'] || 0) * 100),
        floor_price: position.floorPrice || 0,
        listings: position.listings || 0,
        policy_id: position.policy || '',
      });
    });

    // Process LP tokens
    (data.positionsLp || []).forEach((position: any) => {
      if (!position) return;
      lp_tokens.push({
        token_name: position.name || `${position.exchange || 'Unknown'} LP`,
        amount: position.balance || position.amount_lp || 0,
        price: position.price || ((position.adaValue && position.balance) ? (position.adaValue / position.balance) : 0),
        change_1d: ((position['24h'] || 0) * 100),
        change_7d: ((position['7d'] || 0) * 100),
        change_30d: ((position['30d'] || 0) * 100),
        token_a: position.tokenA || '',
        token_a_amount: position.tokenAAmount || 0,
        token_b: position.tokenB || '',
        token_b_amount: position.tokenBAmount || 0,
      });
    });
  }
  // Structure 3: Wallet endpoint with lovelace and assets array
  else if (data.lovelace !== undefined || data.assets) {
    console.log("Processing API response structure with lovelace and assets");
    
    // ADA amount from lovelace (if available)
    const adaAmount = data.lovelace !== undefined ? parseInt(data.lovelace) / 1000000 : 0;
    
    // Add ADA to fungible tokens
    fungible_tokens.push({
      token_name: 'ADA',
      amount: adaAmount,
      price: 1.0, // ADA price in terms of itself is 1
      change_1d: 0,
      change_7d: 0,
      change_30d: 0,
    });

    // Process other assets if available
    if (Array.isArray(data.assets)) {
      data.assets.forEach((asset: any) => {
        if (!asset) return;
        
        // Create base token object
        const token: Token = {
          token_name: asset.token_registry?.name || 
                     asset.metadata?.name || 
                     (asset.fingerprint ? `${asset.policy_id?.substring(0, 6) || ''}...${asset.fingerprint?.substring(0, 6) || ''}` : asset.asset_name || 'Unknown Token'),
          amount: parseInt(asset.quantity || '0'),
          price: asset.price_ada || 0,
          change_1d: (asset.change_24h || 0) * 100, // Convert to percentage if needed
          change_7d: (asset.change_7d || 0) * 100,
          change_30d: (asset.change_30d || 0) * 100,
          policy_id: asset.policy_id || '',
        };

        // Categorize token based on its properties
        if (asset.quantity === '1' && !asset.token_registry && (asset.metadata?.image || asset.policy_id)) {
          // Likely an NFT if quantity is 1 and not registered as a token but has metadata
          nfts.push(token);
        } else if ((asset.token_registry?.name && asset.token_registry.name.toLowerCase().includes('lp')) || 
                  (asset.metadata?.name && asset.metadata.name.toLowerCase().includes('lp')) ||
                  (asset.asset_name && asset.asset_name.toLowerCase().includes('lp'))) {
          // Identify LP tokens by name
          lp_tokens.push(token);
        } else {
          // Default to fungible token
          fungible_tokens.push(token);
        }
      });
    }
  }
  // Structure 4: Unknown structure, log and return empty
  else {
    console.warn("Unknown TapTools API response structure:", data);
    return { fungible_tokens, nfts, lp_tokens };
  }

  // Calculate total value if not provided by API
  if (total_ada_value === 0) {
    // Calculate from the token data
    const fungibleTotal = fungible_tokens.reduce((sum, t) => sum + t.amount * t.price, 0);
    const nftTotal = nfts.reduce((sum, t) => sum + t.amount * t.price, 0);
    const lpTotal = lp_tokens.reduce((sum, t) => sum + t.amount * t.price, 0);
    
    total_ada_value = fungibleTotal + nftTotal + lpTotal;
    total_liquid_value = total_ada_value; // Assume all value is liquid by default
  }

  // Ensure we have data - if we have tokens but they're empty, return mock data
  const hasData = fungible_tokens.length > 0 || nfts.length > 0 || lp_tokens.length > 0;
  if (!hasData) {
    console.warn("Parsed data is empty, returning mock data");
    return generateMockPortfolioData();
  }

  return {
    fungible_tokens,
    nfts,
    lp_tokens,
    total_ada_value,
    total_liquid_value
  };
}

/**
 * Generate mock portfolio data for development/fallback
 */
export function generateMockPortfolioData(): PortfolioData {
  const fungible_tokens = [
    { token_name: 'ADA', amount: 1000, price: 0.45, change_1d: -2.5, change_7d: 5.0, change_30d: 10.0 },
    { token_name: 'SNEK', amount: 5000, price: 0.02, change_1d: 15.0, change_7d: -10.0, change_30d: 20.0 },
    { token_name: 'HOSKY', amount: 10000, price: 0.001, change_1d: 5.0, change_7d: 8.0, change_30d: 15.0 },
    { token_name: 'MIN', amount: 250, price: 0.15, change_1d: -1.0, change_7d: 3.0, change_30d: -5.0 },
  ];
  
  const nfts = [
    { token_name: 'Clay Nation #123', amount: 1, price: 50, change_1d: 0.0, change_7d: 2.0, change_30d: 5.0 },
    { token_name: 'Space Budz #456', amount: 1, price: 100, change_1d: -5.0, change_7d: -2.0, change_30d: 10.0 },
    { token_name: 'Deadpxlz #789', amount: 1, price: 25, change_1d: 10.0, change_7d: 15.0, change_30d: 20.0 },
  ];
  
  const lp_tokens = [
    { 
      token_name: 'Minswap ADA/SNEK LP', 
      amount: 100, 
      price: 10, 
      change_1d: -5.0, 
      change_7d: 3.0, 
      change_30d: 15.0,
      token_a: 'ADA',
      token_a_amount: 200,
      token_b: 'SNEK',
      token_b_amount: 10000
    },
    { 
      token_name: 'WingRiders ADA/HOSKY LP', 
      amount: 50, 
      price: 5, 
      change_1d: 2.0, 
      change_7d: 5.0, 
      change_30d: 8.0,
      token_a: 'ADA',
      token_a_amount: 100,
      token_b: 'HOSKY',
      token_b_amount: 50000
    },
  ];
  
  // Calculate total values
  const fungibleTotal = fungible_tokens.reduce((sum, t) => sum + t.amount * t.price, 0);
  const nftTotal = nfts.reduce((sum, t) => sum + t.amount * t.price, 0);
  const lpTotal = lp_tokens.reduce((sum, t) => sum + t.amount * t.price, 0);
  const total_ada_value = fungibleTotal + nftTotal + lpTotal;
  
  console.log('Generated mock portfolio data with value:', total_ada_value);
  
  return {
    fungible_tokens,
    nfts,
    lp_tokens,
    total_ada_value,
    total_liquid_value: total_ada_value * 0.9, // 90% of total value is liquid
  };
} 