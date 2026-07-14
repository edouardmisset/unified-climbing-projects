import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vite-plus/test'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
