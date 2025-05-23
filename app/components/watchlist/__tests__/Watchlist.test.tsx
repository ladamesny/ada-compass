import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { WatchlistContent } from '@/app/client-components/WatchlistContent';
import { searchTokens } from '@/app/services/api';
import { getMarketCapData } from '@/app/services/taptools';

// --- Comprehensive Mock for app/utils/localStorage.ts ---
let mockWatchlistDB_factory: any[] = []; 

const mockLocalStorageGetWatchlist = jest.fn(() => JSON.parse(JSON.stringify(mockWatchlistDB_factory)));
const mockLocalStorageSaveWatchlist = jest.fn((watchlist) => {
  mockWatchlistDB_factory = JSON.parse(JSON.stringify(watchlist));
});
const mockLocalStorageAddToCart = jest.fn((token) => {
  const currentWatchlist = JSON.parse(JSON.stringify(mockWatchlistDB_factory));
  if (!currentWatchlist.some(t => t.token_name === token.token_name)) {
    const tokenToAdd = {...JSON.parse(JSON.stringify(token)), inWatchlist: true};
    currentWatchlist.push(tokenToAdd);
    mockWatchlistDB_factory = currentWatchlist;
  }
  return JSON.parse(JSON.stringify(mockWatchlistDB_factory)); 
});
const mockLocalStorageRemoveFromCart = jest.fn((tokenName) => {
  let currentWatchlist = JSON.parse(JSON.stringify(mockWatchlistDB_factory));
  currentWatchlist = currentWatchlist.filter(token => token.token_name !== tokenName);
  mockWatchlistDB_factory = currentWatchlist;
  return JSON.parse(JSON.stringify(mockWatchlistDB_factory));
});

jest.mock('@/app/utils/localStorage', () => ({
  __esModule: true, 
  getWatchlist: mockLocalStorageGetWatchlist,
  saveWatchlist: mockLocalStorageSaveWatchlist,
  addToWatchlist: mockLocalStorageAddToCart,
  removeFromWatchlist: mockLocalStorageRemoveFromCart,
}));
// --- End of localStorage mock ---

// Mock the API functions
jest.mock('@/app/services/api');
jest.mock('@/app/services/taptools');

const mockedSearchTokens = searchTokens as jest.Mock;
const mockedGetMarketCapData = getMarketCapData as jest.Mock;

const mockSNEK_WatchlistToken = {
  token_name: 'SNEK',
  price: 0.001,
  market_cap: 1000000,
  change_1d: 5.00,
  amount: 0, 
  change_7d: 0,
  change_30d: 0,
  inWatchlist: false, 
  id: 'snek_id', 
  symbol: 'SNEK'
};

describe('Watchlist Functionality (Focused Tests)', () => {
  beforeEach(() => {
    mockedSearchTokens.mockReset();
    mockedGetMarketCapData.mockReset();
    
    mockLocalStorageGetWatchlist.mockClear();
    mockLocalStorageSaveWatchlist.mockClear();
    mockLocalStorageAddToCart.mockClear();
    mockLocalStorageRemoveFromCart.mockClear();
    
    mockWatchlistDB_factory = []; 
    mockLocalStorageGetWatchlist.mockReturnValue(JSON.parse(JSON.stringify(mockWatchlistDB_factory)));

    mockedSearchTokens.mockImplementation(async (query: string) => {
      if (query.toLowerCase() === 'snek') {
        return [JSON.parse(JSON.stringify(mockSNEK_WatchlistToken))];
      }
      return [];
    });

    mockedGetMarketCapData.mockImplementation(async (tokenIds: string[]) => {
      const responseData: any = {};
      if (tokenIds.includes(mockSNEK_WatchlistToken.id)) {
        responseData[mockSNEK_WatchlistToken.id] = {
          usd: mockSNEK_WatchlistToken.price,
          usd_market_cap: mockSNEK_WatchlistToken.market_cap,
          usd_24h_change: mockSNEK_WatchlistToken.change_1d,
        };
      }
      return responseData;
    });
  });

  test('1. Search for "SNEK"', async () => {
    render(<WatchlistContent />);
    const searchInput = screen.getByPlaceholderText('Search by token name...');
    fireEvent.change(searchInput, { target: { value: 'SNEK' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    let snekSearchResultRow: HTMLElement | null = null;
    await waitFor(() => {
      snekSearchResultRow = screen.getByText(mockSNEK_WatchlistToken.token_name).closest('tr');
      expect(snekSearchResultRow).not.toBeNull();
    });
    if (!snekSearchResultRow) throw new Error("SNEK search result row not found");
    
    expect(within(snekSearchResultRow).getByText(`₳${mockSNEK_WatchlistToken.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`)).toBeInTheDocument();
    expect(within(snekSearchResultRow).getByText(`₳${mockSNEK_WatchlistToken.market_cap.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`)).toBeInTheDocument();
    expect(within(snekSearchResultRow).getByText(expect.stringContaining(mockSNEK_WatchlistToken.change_1d.toFixed(2)))).toBeInTheDocument();
    expect(within(snekSearchResultRow).getByText(expect.stringContaining('%'))).toBeInTheDocument();
    expect(within(snekSearchResultRow).getByRole('button', { name: /Add to Watchlist/i })).toBeInTheDocument();
  });

  test('2. Add "SNEK" to Watchlist', async () => {
    render(<WatchlistContent />);
    const searchInput = screen.getByPlaceholderText('Search by token name...');
    fireEvent.change(searchInput, { target: { value: 'SNEK' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    let snekSearchResultRow: HTMLElement | null = null;
    await waitFor(() => {
      snekSearchResultRow = screen.getByText(mockSNEK_WatchlistToken.token_name).closest('tr');
      expect(snekSearchResultRow).not.toBeNull();
    });
    
    if (!snekSearchResultRow) throw new Error("SNEK search result row not found");

    const addButton = within(snekSearchResultRow).getByRole('button', { name: /Add to Watchlist/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(within(snekSearchResultRow!).getByRole('button', { name: /Remove/i })).toBeInTheDocument();
    });
    
    expect(mockLocalStorageAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ token_name: mockSNEK_WatchlistToken.token_name })
    );
    
    const watchlistTable = await screen.findByTestId('watchlist-table');
    await waitFor(() => {
      expect(within(watchlistTable).getByText(mockSNEK_WatchlistToken.token_name)).toBeInTheDocument();
    });
  });

  test('3. Remove "SNEK" from Watchlist (via WatchlistTable)', async () => {
    const snekInDb = { ...mockSNEK_WatchlistToken, inWatchlist: true };
    mockWatchlistDB_factory = [JSON.parse(JSON.stringify(snekInDb))];
    mockLocalStorageGetWatchlist.mockReturnValue(JSON.parse(JSON.stringify(mockWatchlistDB_factory)));

    render(<WatchlistContent />);

    const watchlistTable = await screen.findByTestId('watchlist-table');
    let snekRowInTable: HTMLElement | null = null;
    await waitFor(() => {
      snekRowInTable = within(watchlistTable).getByText(mockSNEK_WatchlistToken.token_name).closest('tr');
      expect(snekRowInTable).not.toBeNull();
    });

    if (!snekRowInTable) throw new Error("SNEK row in table not found for removal");

    const removeButtonInTable = within(snekRowInTable).getByRole('button', { name: /Remove/i });
    fireEvent.click(removeButtonInTable);

    expect(mockLocalStorageRemoveFromCart).toHaveBeenCalledWith(mockSNEK_WatchlistToken.token_name);

    await waitFor(() => {
      expect(within(watchlistTable).queryByText(mockSNEK_WatchlistToken.token_name)).not.toBeInTheDocument();
    });
    
    expect(mockWatchlistDB_factory).toEqual([]);
  });
});
