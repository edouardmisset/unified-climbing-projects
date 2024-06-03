import { SpeedInsights } from '@vercel/speed-insights/next'

import '~/styles/globals.css'

import { TRPCReactProvider } from '~/trpc/react'

import './reset.css'
import './quick-upgrades.css'
import './global-styles.css'
import Link from 'next/link'
import Sync from './_components/sync-button/sync-button'
import { ThemeProvider } from './_components/theme-provider'

export const metadata = {
  title: 'Unified Climbing Projects',
  description: 'Collection of Climbing Visualization pages',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const thisYear = new Date().getFullYear()
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header>
              <nav>
                <ul
                  className="wrap gap flex-center flex-even margin-auto flex-row"
                  style={{
                    minHeight: '3rem',
                    listStyle: 'none',
                  }}
                >
                  <li>
                    <Link href={'/'}>Home</Link>
                  </li>
                  <li>
                    <Link href={'/log'}>Log</Link>
                  </li>
                  <li>
                    <Link href={'/qr-code/ascents'}>Ascents QR</Link>
                  </li>
                  <li>
                    <Link href={'/barcode/ascents'}>Ascents Barcode</Link>
                  </li>
                  <li>
                    <Link href={`/visualization/ascents/${thisYear}`}>
                      Ascents Visualization
                    </Link>
                  </li>
                  <li>
                    <Link href={'/qr-code/training'}>Training QR</Link>
                  </li>
                  <li>
                    <Link href={`/barcode/training/${thisYear}`}>
                      Training Barcode
                    </Link>
                  </li>
                  <li>
                    <Link href={`/visualization/training/${thisYear}`}>
                      Training Visualization
                    </Link>
                  </li>
                  <li>
                    <Sync />
                  </li>
                </ul>
              </nav>
            </header>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
