'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { lazy, type ReactNode, Suspense, useMemo } from 'react'
import { ToastContainer } from 'react-toastify'
import { Loader } from '~/app/_components/loader/loader'
import { Navigation } from '~/app/_components/navigation/navigation.tsx'
import { env } from '~/env.js'
import { useTheme } from '~/hooks/use-theme'
import { TRPCReactProvider } from '~/trpc/react'
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
import { LightDarkSwitch } from './_components/light-dark-switch/light-dark-switch'

// Dynamic import for ReactQueryDevtools & React Scan - only loads in development
const ReactQueryDevtools = lazy(() =>
  env.NEXT_PUBLIC_ENV === 'development'
    ? import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => <></> }),
)
const ReactScan = lazy(() =>
  env.NEXT_PUBLIC_ENV === 'development'
    ? import('~/app/_components/react-scan/react-scan.tsx').then(module => ({
        default: module.ReactScan,
      }))
    : Promise.resolve({ default: () => <></> }),
)

export const fetchCache = 'default-cache'

export default function RootLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme()

  const appearance = useMemo(
    () => ({
      baseTheme: theme === 'dark' ? dark : neobrutalism,
      variables: { colorPrimary: 'hsl(255deg 93% 72%)' },
    }),
    [theme],
  )

  return (
    <ViewTransitions>
      <ClerkProvider appearance={appearance}>
        <html
          data-color-scheme={theme}
          lang="en"
          suppressHydrationWarning={true}
        >
          <body className={styles.body}>
            <header className={styles.header}>
              <LightDarkSwitch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <Navigation />
            </header>
            <main className={styles.main}>
              <Suspense fallback={<Loader />}>
                <TRPCReactProvider>
                  {env.NEXT_PUBLIC_ENV === 'development' && (
                    <Suspense fallback={null}>
                      <ReactQueryDevtools
                        buttonPosition="bottom-right"
                        initialIsOpen={false}
                        position="right"
                      />
                      <ReactScan />
                    </Suspense>
                  )}
                  <NuqsAdapter>{children}</NuqsAdapter>
                </TRPCReactProvider>
              </Suspense>
            </main>

            <ToastContainer
              closeOnClick
              draggable
              draggableDirection="x"
              draggablePercent={20}
              theme="colored"
            />
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  )
}
