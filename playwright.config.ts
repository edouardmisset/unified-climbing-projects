import { defineConfig, devices } from '@playwright/test'

// Playwright runs against a real Clerk + Convex environment (no offline/
// synthetic data source). Authentication is handled per-test via
// `@clerk/testing`'s Testing Tokens, see `tests/global-setup.ts` and
// `tests/smoke.spec.ts`.
export default defineConfig({
  fullyParallel: false,
  globalSetup: './tests/global-setup.ts',
  outputDir: 'test-results',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  reporter: 'html',
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'next dev',
    reuseExistingServer: process.env.CI === undefined,
    timeout: 120_000,
    url: 'http://127.0.0.1:3000',
  },
  workers: 1,
})
