'use client'

import { useState } from 'react'
import { Navigation } from '~/app/_components/navigation/navigation.tsx'
import { useTheme } from '~/hooks/use-theme'
import styles from './header.module.css'

export function Header() {
  const [desktopNavExpanded, setDesktopNavExpanded] = useState(true)
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

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
