'use client';

import { Token } from '@/app/types';

interface TokenTableProps {
  tokens: Token[];
  title: string;
}

// Helper function to render price change with colors
function PriceChange({ change }: { change: number }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  const colorClass = isPositive
    ? 'text-green-600 dark:text-green-400'
    : isNeutral
    ? 'text-gray-500 dark:text-gray-400'
    : 'text-red-600 dark:text-red-400';
    
  const sign = isPositive ? '+' : '';
  
  return (
    <span className={colorClass}>
      {sign}{change.toFixed(2)}%
    </span>
  );
}

export function TokenTable({ tokens, title }: TokenTableProps) {
  // Handle empty token array case
  if (!tokens || tokens.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No {title.toLowerCase()} available
      </div>
    );
  }

  // Different table layouts for different token types
  if (title === "LP Tokens" && tokens.some(token => token.token_a !== undefined)) {
    return renderLpTokensTable(tokens);
  } else if (title === "NFTs") {
    return renderNftTokensTable(tokens);
  } else {
    // Default to fungible tokens table
    return renderFungibleTokensTable(tokens);
  }
}

function renderFungibleTokensTable(tokens: Token[]) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price (ADA)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Value (ADA)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              1d Change
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              7d Change
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              30d Change
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tokens.map((token, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 dark:text-white">{token.token_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                ₳{token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                ₳{(token.amount * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriceChange change={token.change_1d} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriceChange change={token.change_7d} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PriceChange change={token.change_30d} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderNftTokensTable(tokens: Token[]) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Balance
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Floor Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Value (ADA)
            </th>
            {tokens.some(token => token.change_1d !== undefined || token.change_1d !== 0) && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                1d Change
              </th>
            )}
            {tokens.some(token => token.change_7d !== undefined || token.change_7d !== 0) && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                7d Change
              </th>
            )}
            {tokens.some(token => token.change_30d !== undefined || token.change_30d !== 0) && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                30d Change
              </th>
            )}
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tokens.map((token, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 dark:text-white">{token.token_name}</div>
                {token.policy_id && (
                  <div className="text-xs text-gray-500 dark:text-gray-400" title={token.policy_id}>
                    {token.policy_id.substring(0, 10)}...
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.amount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                ₳{(token.floor_price || token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                ₳{(token.amount * (token.floor_price || token.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              {tokens.some(token => token.change_1d !== undefined || token.change_1d !== 0) && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceChange change={token.change_1d} />
                </td>
              )}
              {tokens.some(token => token.change_7d !== undefined || token.change_7d !== 0) && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceChange change={token.change_7d} />
                </td>
              )}
              {tokens.some(token => token.change_30d !== undefined || token.change_30d !== 0) && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriceChange change={token.change_30d} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderLpTokensTable(tokens: Token[]) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pool
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              LP Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token A
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount A
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Token B
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Amount B
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Value (ADA)
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tokens.map((token, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 dark:text-white">{token.token_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.token_a || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.token_a_amount ? token.token_a_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.token_b || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {token.token_b_amount ? token.token_b_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                ₳{(token.amount * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 