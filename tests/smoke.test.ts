import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Home/)
    await expect(page.getByText(/All Time/)).toBeVisible()
  })
})

test.describe('Visualization page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/visualization')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Visualization/)
    await expect(page.getByText(/Visualization/)).toBeVisible()
  })
})

test.describe('ascents page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/ascents')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Table/)
    await expect(page.getByText(/Ascents/)).toBeVisible()
  })
})

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/ascents/dashboard')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/)
    await expect(page.getByText(/Dashboard/)).toBeVisible()
  })
})
