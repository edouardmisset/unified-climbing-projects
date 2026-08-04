import { clerk } from '@clerk/testing/playwright'
import { expect, type Page, test } from '@playwright/test'

// Requires a dedicated Clerk test-mode user (not a real account). Set these in
// `.env`/`.env.local` — see `.env.example`.
const email = process.env.E2E_CLERK_USER_EMAIL
const HTTP_NOT_FOUND = 404
const FIXTURE_YEAR = 2_025
const ALL_ROUTES_TIMEOUT_MS = 120_000

async function expectPageHeading(
  page: Page,
  path: string,
  heading: RegExp | string,
): Promise<void> {
  await page.goto(path)
  await expect(page).toHaveURL(new RegExp(`${path}$`, 'u'))
  await expect(page.getByRole('heading', { name: heading })).toBeVisible()
}

test.describe('public smoke test', () => {
  test('every public page is reachable', async ({ page }) => {
    await expectPageHeading(page, '/', 'Your climbing history, finally in one place.')
    await expectPageHeading(page, '/privacy', 'Privacy')
    await expectPageHeading(page, '/terms', 'Beta terms')

    await page.goto('/sign-in')
    await expect(page).toHaveURL(/\/sign-in$/u)
    await expect(page.getByRole('navigation', { name: 'Public navigation' })).toBeVisible()

    await page.goto('/sign-up')
    await expect(page).toHaveURL(/\/sign-up$/u)
    await expect(page.getByRole('navigation', { name: 'Public navigation' })).toBeVisible()
  })

  test('a protected page redirects to sign-in', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/sign-in(?:\?|$)/u)
  })
})

test.describe('authenticated smoke test', () => {
  test.skip(
    email === undefined || email === '',
    'Set E2E_CLERK_USER_EMAIL (a dedicated Clerk test-mode user) to run this test.',
  )

  test('a signed-in user reaches every authenticated page', async ({ page }) => {
    test.setTimeout(ALL_ROUTES_TIMEOUT_MS)

    await page.goto('/')

    await clerk.signIn({
      emailAddress: email ?? '',
      page,
    })

    await expectPageHeading(page, '/wrap-up', 'All Time')
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()

    await page.goto(`/wrap-up/${FIXTURE_YEAR}`)
    await expect(page).toHaveURL(new RegExp(`/wrap-up/${FIXTURE_YEAR}$`, 'u'))
    await expect(page.locator('h1')).toContainText(String(FIXTURE_YEAR))

    await expectPageHeading(page, '/log', 'Log')
    await expectPageHeading(page, '/indicators', 'Indicators')
    await expectPageHeading(page, '/ascents', 'Ascents')
    await expectPageHeading(page, '/ascents/top-ten', 'Top Ten')
    await expectPageHeading(page, '/ascents/dashboard', 'Dashboard')
    await expectPageHeading(page, '/ascents/calendar', 'Ascents Calendar')
    await expectPageHeading(page, '/ascents/barcode', /^(?:Ascents Barcode|Not Found)$/u)
    await expectPageHeading(page, '/ascents/qr-code', /^(?:Ascents QR|Not Found)$/u)

    await page.goto('/ascents/e2e-missing-ascent')
    await expect(page).toHaveURL(/\/ascents\/e2e-missing-ascent$/u)
    await expect(page.getByText('Ascent not found', { exact: true })).toBeVisible()

    await expectPageHeading(page, '/training-sessions', 'Training')
    await expectPageHeading(page, '/training-sessions/dashboard', 'Training Dashboard')
    await expectPageHeading(page, '/training-sessions/calendar', 'Training Calendar')
    await expectPageHeading(page, '/training-sessions/barcode', /^(?:Training Barcode|Not Found)$/u)
    await expectPageHeading(page, '/training-sessions/qr-code', /^(?:Training QR|Not Found)$/u)

    await page.goto('/ascent-form')
    await expect(page).toHaveURL(/\/log$/u)
    await expect(page.getByRole('heading', { name: 'Log' })).toBeVisible()

    await page.goto('/training-session-form')
    await expect(page).toHaveURL(/\/log$/u)
    await expect(page.getByRole('heading', { name: 'Log' })).toBeVisible()

    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Import your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Export your data' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Account and deletion' })).toBeVisible()

    const retiredRouteResponse = await page.goto('/import')

    expect(retiredRouteResponse?.status()).toBe(HTTP_NOT_FOUND)
    await expect(page.getByRole('heading', { name: 'Not Found' })).toBeVisible()
  })
})
