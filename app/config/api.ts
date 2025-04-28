// API Configuration

// TapTools API
export const TAPTOOLS_CONFIG = {
  API_URL: 'https://openapi.taptools.io/api/v1',
  API_KEY: process.env.NEXT_PUBLIC_TAPTOOLS_API_KEY || '',
};

// CoinGecko API
export const COINGECKO_CONFIG = {
  API_URL: 'https://api.coingecko.com/api/v3',
  API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '',
};

// Blockfrost API (alternative Cardano data source)
export const BLOCKFROST_CONFIG = {
  API_URL: 'https://cardano-mainnet.blockfrost.io/api/v0',
  API_KEY: process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || '',
};

// Environment detection
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Feature flags
export const FEATURES = {
  USE_MOCK_DATA: IS_DEVELOPMENT && !TAPTOOLS_CONFIG.API_KEY,
  ENABLE_BLOCKFROST_FALLBACK: true,
}; 