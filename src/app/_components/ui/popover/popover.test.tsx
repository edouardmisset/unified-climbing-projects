import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { Popover } from './popover'

describe('popover', () => {
  it('opens from its native trigger and supports light dismissal', async () => {
    const screen = await render(
      <>
        <button type='button'>Outside</button>
        <Popover aria-label='Show details' popoverTitle='Details' trigger='Open details'>
          Popover content
        </Popover>
      </>,
    )

    const trigger = screen.getByRole('button', { name: 'Show details' })
    const popup = screen.container.querySelector<HTMLElement>('[popover="auto"]')

    if (!popup) throw new Error('Expected an automatic native popover')

    await expect.element(trigger).toHaveAttribute('popovertarget', popup.id)
    await expect.element(trigger).toHaveAttribute('type', 'button')

    await trigger.click()

    expect(popup.matches(':popover-open')).toBe(true)
    await expect.element(screen.getByRole('heading', { name: 'Details' })).toBeVisible()
    await expect.element(screen.getByText('Popover content')).toBeVisible()

    await trigger.click()

    expect(popup.matches(':popover-open')).toBe(false)

    await trigger.click()
    await screen.getByRole('button', { name: 'Outside' }).click()

    expect(popup.matches(':popover-open')).toBe(false)
  })
})
