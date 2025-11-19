import './globals.css'
import type { Metadata } from 'next'

import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Task Board Desktop',
  description: 'Cross-platform task manager desktop app (Electron + Next.js + NestJS)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
