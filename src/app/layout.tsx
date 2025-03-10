import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode, Suspense } from 'react'
import { Loader } from '~/app/_components/loader/loader'
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
  children: ReactNode
}) {
  return (
    <ViewTransitions>
      <head>
        {env.NEXT_PUBLIC_ENV === 'development' && (
          <script src="//unpkg.com/react-scan/dist/auto.global.js" />
        )}
      </head>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en" suppressHydrationWarning={true}>
          <body className={styles.body}>
            <Suspense fallback={<Loader />}>
              <TRPCReactProvider>
                <NuqsAdapter>
                  <Navigation />
                  <main className={styles.main}>{children}</main>
                </NuqsAdapter>
              </TRPCReactProvider>
            </Suspense>
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  )
}

export const metadata = {
  title: 'Unified Climbing Projects',
  description:
    'Collection of Climbing Visualization pages, charts and summaries',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}
