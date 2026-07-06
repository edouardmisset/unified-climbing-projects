import { useCallback, useSyncExternalStore } from 'react'

const THEMES = ['light', 'dark'] as const
type ThemeMode = (typeof THEMES)[number]

function isThemeMode(value: string): value is ThemeMode {
  return THEMES.includes(value)
}

const THEME_STORAGE_KEY = 'theme'
const THEME_CHANGE_EVENT = 'themechange'

function getStoredTheme() {
  if (typeof globalThis.window === 'undefined') return null

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored && isThemeMode(stored) ? stored : null
  } catch {
    return null
  }
}

function getSystemTheme(): ThemeMode {
  if (typeof globalThis.window === 'undefined') return 'light'

  return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getThemeSnapshot(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme()
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  if (typeof globalThis.window === 'undefined') return () => {}

  const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)')
  const handleThemeChange = () => onStoreChange()
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onStoreChange()
  }

  mediaQuery.addEventListener('change', handleThemeChange)
  globalThis.window.addEventListener('storage', handleStorage)
  globalThis.window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)

  return () => {
    mediaQuery.removeEventListener('change', handleThemeChange)
    globalThis.window.removeEventListener('storage', handleStorage)
    globalThis.window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getThemeSnapshot, () => 'light')

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
      globalThis.window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme])

  return { theme, toggleTheme }
}
