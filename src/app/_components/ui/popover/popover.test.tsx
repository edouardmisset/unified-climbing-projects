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

  it('shows a native hint popover while its trigger is hovered', async () => {
    const screen = await render(
      <Popover popoverTitle='Details' showOnInterest trigger='Open details'>
        Popover content
      </Popover>,
    )

    const trigger = screen.getByRole('button', { name: 'Open details' })
    const hint = screen.container.querySelector<HTMLElement>('[popover="hint"]')

    if (!hint) throw new Error('Expected a hint popover')

    await trigger.hover()

    await expect.element(hint).toBeVisible()
  })

  it('only shows the hint for the most recently hovered trigger', async () => {
    const screen = await render(
      <>
        <Popover popoverTitle='First details' showOnInterest trigger='First'>
          First content
        </Popover>
        <Popover popoverTitle='Second details' showOnInterest trigger='Second'>
          Second content
        </Popover>
      </>,
    )

    const [firstHint, secondHint] =
      screen.container.querySelectorAll<HTMLElement>('[popover="hint"]')

    if (!firstHint || !secondHint) throw new Error('Expected two hint popovers')

    await screen.getByRole('button', { name: 'First' }).hover()
    await expect.element(firstHint).toBeVisible()

    await screen.getByRole('button', { name: 'Second' }).hover()

    await expect.element(firstHint).not.toBeVisible()
    await expect.element(secondHint).toBeVisible()
  })
})
