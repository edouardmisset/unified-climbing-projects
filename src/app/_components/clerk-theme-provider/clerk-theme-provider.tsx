'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { type ReactNode, useEffect } from 'react'
import { useTheme } from '~/hooks/use-theme'

export function ClerkThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.dataset.colorScheme = theme
  }, [theme])

  const appearance = {
    baseTheme: theme === 'dark' ? dark : undefined,
    variables: {
      borderRadius: 'var(--radius-2)',
      colorBackground: 'var(--surface-2)',
      colorInputBackground: 'var(--control-bg)',
      colorInputText: 'var(--text-1)',
      colorPrimary: 'var(--accent)',
      colorText: 'var(--text-1)',
      colorTextSecondary: 'var(--text-2)',
      fontFamily: 'var(--font-atkinson)',
    },
  }

  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}
