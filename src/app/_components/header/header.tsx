'use client'

import { useState } from 'react'
import { Navigation } from '~/app/_components/navigation/navigation.tsx'
import { ThemeToggle } from '~/app/_components/theme-toggle/theme-toggle'

type HeaderProps = {
  className?: string
  isDark: boolean
  onToggleTheme: () => void
}

export function Header({ className, isDark, onToggleTheme }: HeaderProps) {
  const [desktopNavExpanded, setDesktopNavExpanded] = useState(true)

  return (
    <header className={className} data-desktop-expanded={desktopNavExpanded}>
      <ThemeToggle checked={isDark} onChange={onToggleTheme} />
      <Navigation
        desktopExpanded={desktopNavExpanded}
        onDesktopExpandedChange={setDesktopNavExpanded}
      />
    </header>
  )
}
