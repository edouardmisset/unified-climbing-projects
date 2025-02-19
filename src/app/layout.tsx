import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
import type React from 'react'
import { env } from '~/env.js'
import { TRPCReactProvider } from '~/trpc/react'
import { Navigation } from './_components/navigation/navigation.tsx'
import styles from './index.module.css'

import '~/styles/sizes.css'
import '~/styles/colors.css'
import '~/styles/animation.css'
import '~/styles/aspects.css'
import '~/styles/border.css'
import '~/styles/button.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/fonts.css'
import '~/styles/gradients.css'
import '~/styles/shadows.css'
import '~/styles/zindex.css'

import '~/styles/climbing-colors.css'

import '~/styles/reset.css'

import '~/styles/utilities.css'

export const fetchCache = 'default-cache'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ViewTransitions>
      <head>
        {env.NEXT_PUBLIC_ENV === 'development' && (
          <script src="//unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={styles.body}>
          <TRPCReactProvider>
            <Navigation />
            <main className={styles.main}>{children}</main>
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
