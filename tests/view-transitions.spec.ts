import { expect, test } from '@playwright/test'

const appURL = process.env.APP_URL ?? ''

test.describe('view transitions', () => {
  test('navigates without a native view transition', async ({ page }) => {
    await page.addInitScript(() => {
      const startViewTransition = document.startViewTransition.bind(document)

      document.startViewTransition = (...args) => {
        globalThis.sessionStorage.setItem('view-transition-argument', typeof args[0])
        return startViewTransition(...args)
      }
    })
    await page.goto(`${appURL}/`)

    await page
      .getByRole('navigation', { name: 'Public navigation' })
      .getByRole('link', { name: 'Terms' })
      .click()

    await expect(page).toHaveURL(/\/terms$/u)
    await expect
      .poll(async () =>
        page.evaluate(() => globalThis.sessionStorage.getItem('view-transition-argument')),
      )
      .toBeNull()
  })

  test('navigates when view transitions are unsupported', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(globalThis.Document.prototype, 'startViewTransition', {
        configurable: true,
        value: undefined,
      })
    })
    await page.goto(`${appURL}/`)

    await page
      .getByRole('navigation', { name: 'Public navigation' })
      .getByRole('link', { name: 'Terms' })
      .click()

    await expect(page).toHaveURL(/\/terms$/u)
    await expect(page.getByRole('heading', { name: 'Beta terms' })).toBeVisible()
  })
})
