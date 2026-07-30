import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { Storage } from 'happy-dom'
import { afterEach } from 'vite-plus/test'

// Node 22+ ships an experimental global `localStorage` that vitest's happy-dom
// environment defers to (since it predates the override list), but it throws
// without a `--localstorage-file`. Replace it with a real implementation.
Object.defineProperty(globalThis, 'localStorage', {
  value: new Storage(),
  configurable: true,
  writable: true,
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
