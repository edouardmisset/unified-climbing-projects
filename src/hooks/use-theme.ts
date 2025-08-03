import { useCallback, useEffect, useState } from 'react'

type ThemeMode = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem('theme') ?? 'light'
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      return
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      return
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch (error) {
        console.warn('Failed to save theme preference:', error)
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
