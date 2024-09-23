import { SpeedInsights } from '@vercel/speed-insights/next'

import { TRPCReactProvider } from '~/trpc/react'

import '~/styles/reset.css'
import '~/styles/colors.css'
import '~/styles/border.css'
import '~/styles/aspects.css'
import '~/styles/animation.css'
import '~/styles/brand.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/gradients.css'
import '~/styles/shadows.css'
import '~/styles/sizes.css'
import '~/styles/zindex.css'
import '~/styles/quick-upgrades.css'
import '~/styles/global-styles.css'
import '~/styles/button.css'
import '~/styles/normalize.css'

import Link from 'next/link'
import Sync from './_components/sync-button/sync-button'

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
          <header>
            <nav>
              <ul
                className="wrap gap center space-evenly margin-auto flex-row"
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
        </TRPCReactProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
