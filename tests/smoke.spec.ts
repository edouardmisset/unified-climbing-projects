import { clerk } from '@clerk/testing/playwright'
import { expect, test } from '@playwright/test'

// Requires a dedicated Clerk test-mode user (not a real account). Set these in
// `.env`/`.env.local` — see `.env.example`.
const email = process.env.E2E_CLERK_USER_EMAIL
const HTTP_NOT_FOUND = 404

test.describe('authenticated smoke test', () => {
  test.skip(
    email === undefined || email === '',
    'Set E2E_CLERK_USER_EMAIL (a dedicated Clerk test-mode user) to run this test.',
  )

  test('a signed-in user reaches the authenticated app shell', async ({ page }) => {
    await page.goto('/')

    await clerk.signIn({
      emailAddress: email ?? '',
      page,
    })

    await page.goto('/wrap-up')

    await expect(page).toHaveURL(/\/wrap-up$/u)
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()

    await page.goto('/ascents')
    await expect(page.getByRole('heading', { name: 'Ascents' })).toBeVisible()

    await page.goto('/training-sessions')
    await expect(page.getByRole('heading', { name: 'Training' })).toBeVisible()

    await page.goto('/log')
    await expect(page.getByRole('heading', { name: 'Log' })).toBeVisible()

    await page.goto('/ascent-form')
    await expect(page).toHaveURL(/\/log$/u)
    await expect(page.getByRole('heading', { name: 'Log' })).toBeVisible()

    await page.goto('/settings')

    await expect(page.getByRole('heading', { name: 'Import your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Export your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Account and deletion' })).toBeVisible()

    const retiredRouteResponse = await page.goto('/import')

    expect(retiredRouteResponse?.status()).toBe(HTTP_NOT_FOUND)
    await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible()
  })
})
