import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TRPCReactProvider } from '~/trpc/react'

import '~/styles/reset.css'
import '~/styles/normalize.css'

import '~/styles/animation.css'
import '~/styles/aspects.css'
import '~/styles/border.css'
import '~/styles/brand.css'
import '~/styles/button.css'
import '~/styles/colors.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/fonts.css'
import '~/styles/global-styles.css'
import '~/styles/gradients.css'
import '~/styles/quick-upgrades.css'
import '~/styles/shadows.css'
import '~/styles/sizes.css'
import '~/styles/zindex.css'

import { Navigation } from './_components/navigation/navigation.tsx'

import type React from 'react'
import styles from './index.module.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={styles.body}>
        <TRPCReactProvider>
          <NuqsAdapter>
            <header className={styles.header}>
              <Navigation />
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
              <p>@edouardmisset 2024-{new Date().getFullYear()}</p>
            </footer>
          </NuqsAdapter>
        </TRPCReactProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Unified Climbing Projects',
  description: 'Collection of Climbing Visualization pages',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}
