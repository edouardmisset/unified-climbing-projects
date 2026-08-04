import { clerk } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

// Requires a dedicated Clerk test-mode user (not a real account). Set these in
// `.env`/`.env.local` — see `.env.example`.
const email = process.env.E2E_CLERK_USER_EMAIL
const password = process.env.E2E_CLERK_USER_PASSWORD

test.describe('authenticated smoke test', () => {
  test.skip(
    email === undefined || email === '' || password === undefined || password === '',
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

    await page.goto('/ascent-form')
    await expect(page).toHaveURL(/\/log$/u)
    await expect(page.getByRole('heading', { name: 'Log 📋' })).toBeVisible()

    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Import your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Export your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Account and deletion' })).toBeVisible()

    await page.goto('/import')

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  })
})
