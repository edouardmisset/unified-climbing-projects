'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ViewTransitions } from 'next-view-transitions'
import { Atkinson_Hyperlegible as atkinson_Hyperlegible } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import { RscBoundaryProvider } from 'rsc-boundary'
import { Header } from '~/shared/components/header/header.tsx'
import { Loader } from '~/shared/components/ui/loader/loader'
import { APP_LANGUAGE } from '~/shared/constants/generic'
import { useTheme } from '~/shared/hooks/use-theme'

import '~/styles/sizes.css'
import '~/styles/colors.css'
import '~/styles/animation.css'
import '~/styles/border.css'
import '~/styles/button.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/fonts.css'
import '~/styles/shadows.css'
import '~/styles/zindex.css'
import '~/styles/climbing-colors.css'
import '~/styles/reset.css'
import '~/styles/utilities.css'
import styles from './index.module.css'

const font = atkinson_Hyperlegible({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  preload: true,
  variable: '--font-atkinson',
  fallback: ['system-ui', 'sans-serif'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <ViewTransitions>
      <ClerkProvider appearance={dark}>
        <html
          className={font.className}
          data-color-scheme={theme}
          data-scroll-behavior='smooth'
          lang={APP_LANGUAGE}
          suppressHydrationWarning
        >
          <body className={styles.body}>
            <a className={styles.skipLink} href='#main-content'>
              Skip to content
            </a>
            <Header />
            <main className={styles.main} id='main-content' tabIndex={-1}>
              <Suspense fallback={<Loader />}>
                <RscBoundaryProvider>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </RscBoundaryProvider>
              </Suspense>
            </main>

            <ToastContainer
              closeOnClick
              draggable
              draggableDirection='x'
              draggablePercent={20}
              theme='colored'
            />
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </ClerkProvider>
    </ViewTransitions>
  )
}
