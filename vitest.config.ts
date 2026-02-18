// oxlint-disable import/no-nodejs-modules
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules/', 'dist/', 'src/backup/', 'src/scripts/', '**/*smoke*.*'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/backup/',
        'src/scripts/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.config.*',
        '**/types.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '~': path.join(import.meta.dirname, './src'),
    },
  },
})
