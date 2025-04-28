'use client';

import { useState } from 'react';
import { useWatchlist } from '@/app/hooks/useWatchlist';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import { PriceChange } from '@/app/components/watchlist/PriceChange';

export function WatchlistSearch() {
  const { searchResults, isSearching, searchError, addToWatchlist, removeFromWatchlist, searchForTokens } = useWatchlist();
  const [query, setQuery] = useState('');

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchForTokens(query);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Search Tokens</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by token name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth={true}
            />
            <Button type="submit" variant="primary" disabled={isSearching || !query.trim()}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          {searchError && <p className="mt-2 text-red-500 text-sm">{searchError}</p>}
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price (ADA)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    1d Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((token, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{token.token_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      ₳{token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {token.market_cap 
                        ? `₳${(token.market_cap).toLocaleString()}`
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriceChange change={token.change_1d} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => token.inWatchlist 
                          ? removeFromWatchlist(token.token_name)
                          : addToWatchlist(token)
                        }
                        variant={token.inWatchlist ? 'outline' : 'primary'}
                        size="sm"
                      >
                        {token.inWatchlist ? 'Remove' : 'Add to Watchlist'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Empty state if search performed but no results */}
        {query.trim() && searchResults.length === 0 && !isSearching && !searchError && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tokens found matching "{query}"
          </div>
        )}
      </CardContent>
    </Card>
  );
} 