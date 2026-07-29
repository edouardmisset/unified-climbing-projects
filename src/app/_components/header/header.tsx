'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '~/app/_components/navigation/navigation.tsx'
import { useTheme } from '~/hooks/use-theme'
import styles from './header.module.css'

export function Header() {
  const pathname = usePathname()
  const [desktopNavExpanded, setDesktopNavExpanded] = useState(true)
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'
  const isPublicPage = ['/', '/privacy', '/terms', '/sign-in', '/sign-up'].some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  )

  if (isPublicPage) return <></>

  return (
    <header className={styles.header} data-desktop-expanded={desktopNavExpanded}>
      <Navigation
        desktopExpanded={desktopNavExpanded}
        isDark={isDark}
        onDesktopExpandedChange={setDesktopNavExpanded}
        onToggleTheme={toggleTheme}
      />
    </header>
  )
}
