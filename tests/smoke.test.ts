import { expect, test } from '@playwright/test'

const PAGES_TEST_CONFIG = [
  { label: 'Home', path: '/' },
  { label: 'Calendar', path: '/ascents/calendar', heading: 'Calendar' },
  { label: 'Ascents', path: '/ascents', heading: 'Ascents' },
  {
    label: 'Ascents Barcode',
    path: '/ascents/barcode',
    heading: 'Ascents Barcode',
  },
  { label: 'Ascents QR', path: '/ascents/qr-code', heading: 'Ascents QR' },
  { label: 'Dashboard', path: '/ascents/dashboard', heading: 'Dashboard' },
  { label: 'Top Ten', path: '/ascents/top-ten', heading: 'Top Ten' },
  { label: 'Training', path: '/training-sessions', heading: 'Training' },
  { label: 'Training Calendar', path: '/training-sessions/calendar', heading: 'Training Calendar' },
  {
    label: 'Training Dashboard',
    path: '/training-sessions/dashboard',
    heading: 'Training Dashboard',
  },
  {
    label: 'Training Barcode',
    path: '/training-sessions/barcode',
    heading: 'Training Barcode',
  },
  {
    label: 'Training QR',
    path: '/training-sessions/qr-code',
    heading: 'Training QR',
  },
  { label: 'Indicators', path: '/indicators', heading: 'Indicators' },
  { label: 'Wrap Up All Time', path: '/wrap-up' },
  { label: 'Wrap Up Year', path: '/wrap-up/2024', heading: '2024' },
]

for (const { label, path, heading } of PAGES_TEST_CONFIG) {
  test(`${label} page should load`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    if (heading) await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  })
}

test('should show a single ascent', async ({ page }) => {
  const levitationAscentId = 'j579f2mexz1j2s1esh1aee9gx17r3jde'
  await page.goto(`/ascents/${levitationAscentId}`)
  await page.waitForLoadState('networkidle')
  await page.waitForSelector('text=Lévitation')
  await expect(page.getByRole('heading', { name: 'Lévitation' })).toBeVisible()
})
