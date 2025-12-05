import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/)
    await expect(page.getByText(/All Time/)).toBeVisible()
  })
})

test.describe('Calendar page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents/calendar')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Calendar' })).toBeVisible()
  })
})

test.describe('Ascents page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Ascents/)
    await expect(page.getByRole('heading', { name: 'Ascents' })).toBeVisible()
  })

  test('should show a single ascent', async ({ page }) => {
    const levitationAscentId = 'j579f2mexz1j2s1esh1aee9gx17r3jde'
    await page.goto(`/ascents/${levitationAscentId}`)
    await page.waitForSelector('text=Lévitation')
    await expect(
      page.getByRole('heading', { name: 'Lévitation' }),
    ).toBeVisible()
  })
})

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents/dashboard')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})

test.describe('Top Ten page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents/top-ten')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Top Ten/)
    await expect(page.getByRole('heading', { name: 'Top Ten' })).toBeVisible()
  })
})

test.describe('Training page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/training-sessions')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Training/)
    await expect(page.getByRole('heading', { name: 'Training' })).toBeVisible()
  })
})
