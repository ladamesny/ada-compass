'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/app/hooks/useTheme';
import { WalletProvider } from '@/app/hooks/useWallet';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ThemeProvider>
  );
} 