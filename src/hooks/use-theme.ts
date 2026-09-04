import { useSyncExternalStore } from 'react'

const THEMES = ['light', 'dark'] as const
type ThemeMode = (typeof THEMES)[number]

function isThemeMode(value: string): value is ThemeMode {
  return THEMES.includes(value)
}

const THEME_STORAGE_KEY = 'theme'
const THEME_CHANGE_EVENT = 'themechange'

function readStoredTheme(): ThemeMode | undefined {
  try {
    const stored = globalThis.localStorage.getItem(THEME_STORAGE_KEY)
    return stored !== null && stored !== '' && isThemeMode(stored) ? stored : undefined
  } catch {
    return undefined
  }
}

function getStoredTheme(): ThemeMode | undefined {
  return Reflect.has(globalThis, 'window') ? readStoredTheme() : undefined
}

function getSystemTheme(): ThemeMode {
  if (!Reflect.has(globalThis, 'window')) return 'light'

  return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getThemeSnapshot(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme()
}

function subscribeToThemeChanges(onStoreChange: VoidFunction) {
  if (!Reflect.has(globalThis, 'window'))
    return () => {
      // There is no browser subscription to clean up during server rendering.
    }

  const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)')
  const handleThemeChange = () => {
    onStoreChange()
  }
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

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'

    try {
      globalThis.localStorage.setItem(THEME_STORAGE_KEY, next)
      globalThis.window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
    } catch (error) {
      globalThis.console.warn('Failed to save theme preference:', error)
    }
  }

  return { theme, toggleTheme }
}
