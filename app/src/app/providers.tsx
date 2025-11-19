'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query-provider';

export function AppProviders({ children }: { children: ReactNode }) {

  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
