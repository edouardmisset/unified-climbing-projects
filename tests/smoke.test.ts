import { expect, test } from '@playwright/test'

const port = process.env.PORT ?? 3000

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}`)
  })

  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/)
    await expect(page.getByText(/All Time/)).toBeVisible()
  })
})

test.describe('Visualization page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/visualization`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Visualization/)
    await expect(
      page.getByRole('heading', { name: 'Visualization' }),
    ).toBeVisible()
  })
})

test.describe('Ascents page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Ascents/)
    await expect(page.getByRole('heading', { name: 'Ascents' })).toBeVisible()
  })

  test('should show a single ascent', async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents/1`)
    await page.waitForSelector('text=Lévitation')
    await expect(
      page.getByRole('heading', { name: 'Lévitation' }),
    ).toBeVisible()
  })
})

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents/dashboard`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})

test.describe('Top Ten page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents/top-ten`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Top Ten/)
    await expect(page.getByRole('heading', { name: 'Top Ten' })).toBeVisible()
  })
})

test.describe('Training page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/training-sessions`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Training/)
    await expect(page.getByRole('heading', { name: 'Training' })).toBeVisible()
  })
})
