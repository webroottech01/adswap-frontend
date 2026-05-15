import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap-custom.css';
import './globals.css';
import { StoreProvider } from '@/lib/StoreProvider';
import { GlobalLoadingProvider } from '@/lib/GlobalLoadingProvider';
import { SessionRestorer } from '@/components/SessionRestorer';

export const metadata: Metadata = {
  title: 'AdSwap',
  description: 'AdSwap Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <GlobalLoadingProvider>
            <SessionRestorer />
            {children}
          </GlobalLoadingProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

