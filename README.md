# ADA Compass - Cardano Portfolio Manager

ADA Compass is a web-based application that enables Cardano blockchain users to connect their wallets, view a detailed portfolio of their Cardano Native Tokens (CNTs), manage a token watchlist, and receive trade recommendations based on price movements.

## Features

- Connect Cardano-compatible wallets (Eternl, Nami, Flint)
- View portfolio of Cardano Native Tokens (fungible tokens, NFTs, LP tokens)
- Track BTC and ADA USD prices
- Monitor token price changes (1-day, 7-day, 30-day)
- Search and manage a watchlist of tokens with market cap data
- Get automated trade recommendations based on configurable price thresholds

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Chart.js for data visualization
- MeshJS for Cardano wallet integration
- TapTools API for portfolio data
- CoinGecko API for BTC/ADA USD prices

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- A Cardano wallet extension (Eternl, Nami, Flint)
- TapTools API key (get one at https://taptools.io/dev)

### API Setup

1. Create an account on TapTools and get an API key from their developer portal.
2. Create a `.env.local` file in the project root with your API keys:

```
# TapTools API (required for portfolio data)
NEXT_PUBLIC_TAPTOOLS_API_KEY=your-taptools-api-key

# CoinGecko API (optional, but recommended for USD prices)
NEXT_PUBLIC_COINGECKO_API_KEY=your-coingecko-api-key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ada-compass.git
   cd ada-compass
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js App Router
  - `components/` - UI components
  - `hooks/` - Custom React hooks
  - `services/` - API and data services
    - `taptools.ts` - TapTools API integration
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `config/` - Configuration files

## Usage

1. Connect your Cardano wallet using the "Connect Wallet" button in the header.
2. View your portfolio on the Portfolio page.
3. Search for tokens and add them to your watchlist on the Watchlist page.
4. Configure trade threshold and view recommendations on the Trades page.

## TapTools API Integration

The application uses the TapTools API to fetch portfolio data for connected wallets. Here's how it works:

1. When a user connects their wallet, we retrieve their wallet address and stake address.
2. We use the stake address to query the TapTools API for the user's portfolio data.
3. The API response is parsed and categorized into different token types (fungible, NFTs, LP tokens).
4. The data is displayed in the portfolio view with price information and charts.

If the TapTools API is unavailable or no API key is provided, the application falls back to mock data for development purposes.

## License

This project is licensed under the ISC License. 