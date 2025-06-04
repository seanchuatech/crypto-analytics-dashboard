'use client';

import './globals.css';
import { ReactNode, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
