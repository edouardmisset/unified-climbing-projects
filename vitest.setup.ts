import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vite-plus/test'

// Node 22+ ships an experimental global `localStorage` that vitest's happy-dom
// environment defers to (since it predates the override list), but it throws
// without a `--localstorage-file`. Replace it with a real implementation.
// Real browsers (the browser-mode "components" project) already have a working
// `localStorage` and don't ship `clearImmediate`, which happy-dom's `Storage`
// needs at import time, so skip importing happy-dom there entirely.
if (typeof globalThis.clearImmediate === 'function') {
  const { Storage } = await import('happy-dom')
  Object.defineProperty(globalThis, 'localStorage', {
    value: new Storage(),
    configurable: true,
    writable: true,
  })
}

// Cleanup after each test
afterEach(() => {
  cleanup()
})
