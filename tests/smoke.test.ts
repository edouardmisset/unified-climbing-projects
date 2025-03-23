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
    await expect(page.getByText(/Visualization/)).toBeVisible()
  })
})

test.describe('ascents page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Ascents/)
    await expect(page.getByText(/Ascents/)).toBeVisible()
  })

  test('should show a single ascent', async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents/1`)
    await page.waitForSelector('text=Lévitation')
    await expect(page.getByText(/Lévitation/)).toBeVisible()
  })
})

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:${port}/ascents/dashboard`)
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/)
    await expect(page.getByText(/Dashboard/)).toBeVisible()
  })
})
