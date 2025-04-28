import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Layout } from '@/app/components/layout/Layout';

export const metadata: Metadata = {
  title: 'ADA Compass - Cardano Portfolio Manager',
  description: 'Manage your Cardano wallet portfolio, track tokens, and get trade recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
} 