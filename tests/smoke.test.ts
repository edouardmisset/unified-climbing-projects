import { expect, test } from '@playwright/test'

const HOME_REGEX = /Home/
const ALL_TIME_REGEX = /All Time/
const ASCENTS_REGEX = /Ascents/
const DASHBOARD_REGEX = /Dashboard/
const TOP_TEN_REGEX = /Top Ten/
const TRAINING_REGEX = /Training/

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(HOME_REGEX)
    await expect(page.getByText(ALL_TIME_REGEX)).toBeVisible()
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
    await expect(page).toHaveTitle(ASCENTS_REGEX)
    await expect(page.getByRole('heading', { name: 'Ascents' })).toBeVisible()
  })

  test('should show a single ascent', async ({ page }) => {
    const levitationAscentId = 'j579f2mexz1j2s1esh1aee9gx17r3jde'
    await page.goto(`/ascents/${levitationAscentId}`)
    await page.waitForSelector('text=Lévitation')
    await expect(page.getByRole('heading', { name: 'Lévitation' })).toBeVisible()
  })
})

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents/dashboard')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(DASHBOARD_REGEX)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})

test.describe('Top Ten page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascents/top-ten')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(TOP_TEN_REGEX)
    await expect(page.getByRole('heading', { name: 'Top Ten' })).toBeVisible()
  })
})

test.describe('Training page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/training-sessions')
  })
  test('should load correctly', async ({ page }) => {
    await expect(page).toHaveTitle(TRAINING_REGEX)
    await expect(page.getByRole('heading', { name: 'Training' })).toBeVisible()
  })
})
