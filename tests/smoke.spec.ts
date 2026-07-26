import { clerk } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

// Requires a dedicated Clerk test-mode user (not a real account). Set these in
// `.env`/`.env.local` — see `.env.example`.
const email = process.env.E2E_CLERK_USER_EMAIL
const password = process.env.E2E_CLERK_USER_PASSWORD

test.describe('authenticated smoke test', () => {
  test.skip(
    !email || !password,
    'Set E2E_CLERK_USER_EMAIL and E2E_CLERK_USER_PASSWORD (a dedicated Clerk test-mode user) to run this test.',
  )

  test('a signed-in user reaches the authenticated app shell', async ({ page }) => {
    await page.goto('/')

    await clerk.signIn({
      page,
      signInParams: { identifier: email ?? '', password: password ?? '', strategy: 'password' },
    })

    await page.goto('/wrap-up')

    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
  })
})
