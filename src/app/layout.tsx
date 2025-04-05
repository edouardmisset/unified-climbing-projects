'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { dark, neobrutalism } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import {
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ToastContainer } from 'react-toastify'
import { Loader } from '~/app/_components/loader/loader'
import { Navigation } from '~/app/_components/navigation/navigation.tsx'
import { ReactScan } from '~/app/_components/react-scan/react-scan.tsx'
import { env } from '~/env.js'
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

export const fetchCache = 'default-cache'

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  // on mount read local storage or user system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

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
        {env.NEXT_PUBLIC_ENV === 'development' && <ReactScan />}
        <html
          lang="en"
          data-color-scheme={theme}
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
                  <NuqsAdapter>{children}</NuqsAdapter>
                </TRPCReactProvider>
              </Suspense>
            </main>

            <ToastContainer closeOnClick theme="colored" />
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  )
}
