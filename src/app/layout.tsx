import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
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
import '~/styles/grades.css'
import '~/styles/training.css'
import '~/styles/quick-upgrades.css'
import '~/styles/shadows.css'
import '~/styles/sizes.css'
import '~/styles/zindex.css'

import { Navigation } from './_components/navigation/navigation.tsx'

import type React from 'react'
import { Footer } from './_components/footer/footer.tsx'
import styles from './index.module.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={styles.body}>
          <TRPCReactProvider>
            <NuqsAdapter>
              <header className={styles.header}>
                <Navigation />
              </header>
              <main className={styles.main}>{children}</main>
              <Footer />
            </NuqsAdapter>
          </TRPCReactProvider>
          <SpeedInsights />
          <Analytics />
        </body>
      </html>
    </ViewTransitions>
  )
}

export const metadata = {
  title: 'Unified Climbing Projects',
  description: 'Collection of Climbing Visualization pages',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}
