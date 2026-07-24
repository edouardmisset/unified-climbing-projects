import { SYNTHETIC_ACCEPTANCE_EXPECTATIONS } from '../src/data/synthetic-acceptance-fixture'
import { expect, test } from './fixtures/offline-test'

type PageTestConfig = { heading?: string; label: string; path: string }

const PAGES_TEST_CONFIG: readonly PageTestConfig[] = [
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

test.describe('synthetic offline acceptance', () => {
  for (const { label, path, heading } of PAGES_TEST_CONFIG)
    test(`${label} page loads`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      if (heading) await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    })

  test('renders the deterministic ascent dataset', async ({ page }) => {
    await page.goto('/ascents')

    await Promise.all(
      SYNTHETIC_ACCEPTANCE_EXPECTATIONS.ascentNames.map((name) =>
        expect(page.getByRole('cell', { name, exact: true })).toBeVisible(),
      ),
    )

    await expect(
      page.getByRole('cell', {
        name: new RegExp(SYNTHETIC_ACCEPTANCE_EXPECTATIONS.latestAscent.crag, 'u'),
      }),
    ).toBeVisible()
  })

  test('renders the deterministic training-session dataset', async ({ page }) => {
    await page.goto('/training-sessions')

    await Promise.all(
      SYNTHETIC_ACCEPTANCE_EXPECTATIONS.trainingSessionTypes.map((type) =>
        expect(page.getByRole('cell', { name: type, exact: true })).toBeVisible(),
      ),
    )

    await Promise.all(
      SYNTHETIC_ACCEPTANCE_EXPECTATIONS.trainingSessionLocations.map((location) =>
        expect(page.getByRole('cell', { name: location, exact: true })).toBeVisible(),
      ),
    )
  })

  test('renders a synthetic ascent detail and rejects an unknown ID', async ({ page }) => {
    const { id, name } = SYNTHETIC_ACCEPTANCE_EXPECTATIONS.latestAscent
    await page.goto(`/ascents/${id}`)
    await expect(page.getByRole('heading', { name: new RegExp(name, 'u') })).toBeVisible()

    await page.goto('/ascents/nonexistent-synthetic-ascent')
    await expect(page.getByText('Ascent not found', { exact: true })).toBeVisible()
  })

  test('skip link moves keyboard users to content', async ({ isMobile, page }) => {
    test.skip(isMobile, 'Keyboard navigation is covered by the desktop project')

    await page.goto('/')
    await page.keyboard.press('Tab')

    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    await skipLink.press('Enter')

    const mainContent = page.locator('main#main-content')
    await expect(page).toHaveURL(/#main-content$/u)
    await expect(mainContent).toBeInViewport()
    await expect(mainContent).toBeFocused()
  })
})
