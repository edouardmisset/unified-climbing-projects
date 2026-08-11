import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { Popover } from './popover'

describe('popover', () => {
  it('opens from its trigger and closes when the user clicks outside', async () => {
    const screen = await render(
      <>
        <button type='button'>Outside</button>
        <Popover aria-label='Show details' popoverTitle='Details' trigger='Open details'>
          Popover content
        </Popover>
      </>,
    )

    const trigger = screen.getByRole('button', { name: 'Show details' })
    const content = screen.getByText('Popover content')

    await expect.element(trigger).toHaveAttribute('popovertarget')
    await expect.element(trigger).toHaveAttribute('type', 'button')

    await trigger.click()

    await expect.element(content).toBeVisible()
    await expect.element(screen.getByRole('heading', { name: 'Details' })).toBeVisible()

    await screen.getByRole('button', { name: 'Outside' }).click()

    await expect.element(content).not.toBeVisible()
  })

  it('adds a native hint popover when interest enhancement is enabled', async () => {
    const { container } = await render(
      <Popover popoverTitle='Details' showOnInterest trigger='Open details'>
        Popover content
      </Popover>,
    )

    expect(container.innerHTML).toContain('interestfor=')
    expect(container.innerHTML).toContain('popover="hint"')
  })
})
