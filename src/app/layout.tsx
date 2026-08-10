import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Atkinson_Hyperlegible as atkinson_Hyperlegible } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { type ReactNode, Suspense, ViewTransition } from 'react'
import { ToastContainer } from 'react-toastify'
import { Header } from '~/app/_components/header/header.tsx'
import { Loader } from '~/app/_components/ui/loader/loader'
import { APP_LANGUAGE } from '~/constants/generic'
import { ClerkThemeProvider } from './_components/clerk-theme-provider/clerk-theme-provider'

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
  return (
    <Suspense>
      <ClerkThemeProvider>
        <html
          className={font.className}
          data-scroll-behavior='smooth'
          lang={APP_LANGUAGE}
          suppressHydrationWarning
        >
          <head>
            {/* Inline blocking script to apply the stored/system theme before first paint,
              preventing a flash of the default light theme when the user prefers dark. */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){try{var s=localStorage.getItem('theme');var t=s==='dark'||s==='light'?s:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-color-scheme',t);}catch(e){}})()`,
              }}
            />
          </head>
          <body className={styles.body}>
            <a className={styles.skipLink} href='#main-content'>
              Skip to content
            </a>
            <Header />
            <main className={styles.main} id='main-content' tabIndex={-1}>
              <Suspense fallback={<Loader />}>
                <ViewTransition>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </ViewTransition>
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
      </ClerkThemeProvider>
    </Suspense>
  )
}
