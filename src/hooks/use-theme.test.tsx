import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { useTheme } from './use-theme'

function mockSystemTheme(theme: 'light' | 'dark') {
  vi.spyOn(globalThis.window, 'matchMedia').mockReturnValue({
    matches: theme === 'dark',
    addEventListener: vi.fn<VoidFunction>(),
    removeEventListener: vi.fn<VoidFunction>(),
  } as unknown as MediaQueryList)
}

describe('useTheme', () => {
  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
  ] as const)('uses a valid stored theme: %s', (storedTheme, expectedTheme) => {
    vi.restoreAllMocks()
    globalThis.localStorage.clear()

    globalThis.localStorage.setItem('theme', storedTheme)
    mockSystemTheme(storedTheme === 'dark' ? 'light' : 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe(expectedTheme)
  })

  it.each(['', 'system', 'sepia'])(
    'uses the system theme for an invalid stored value: %s',
    storedTheme => {
      vi.restoreAllMocks()
      globalThis.localStorage.clear()

      globalThis.localStorage.setItem('theme', storedTheme)
      mockSystemTheme('dark')

      const { result } = renderHook(() => useTheme())

      expect(result.current.theme).toBe('dark')
    },
  )

  it('uses the system theme when no stored value exists', () => {
    vi.restoreAllMocks()
    globalThis.localStorage.clear()

    mockSystemTheme('light')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('uses the system theme when storage access fails', () => {
    vi.restoreAllMocks()
    globalThis.localStorage.clear()

    vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })
    mockSystemTheme('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })
})
