import { useEffect } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { Popover } from './popover'

function MountObserver({ onMount }: { onMount: () => void }) {
  useEffect(onMount, [onMount])

  return 'Deferred content'
}

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

    const triggerRect = trigger.element().getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()

    expect(popupRect.left + popupRect.width / 2).toBeCloseTo(
      triggerRect.left + triggerRect.width / 2,
      0,
    )

    await trigger.click()

    expect(popup.matches(':popover-open')).toBe(false)

    await trigger.click()
    await screen.getByRole('button', { name: 'Outside' }).click()

    expect(popup.matches(':popover-open')).toBe(false)
  })

  it('promotes a hovered hint to a persistent popover when its trigger is clicked', async () => {
    const screen = await render(
      <Popover popoverTitle='Details' showOnInterest trigger='Open details'>
        Popover content
      </Popover>,
    )

    const trigger = screen.getByRole('button', { name: 'Open details' })
    const popup = screen.container.querySelector<HTMLElement>('[popover="auto"]')
    const hint = screen.container.querySelector<HTMLElement>('[popover="hint"]')

    if (!popup || !hint) throw new Error('Expected automatic and hint popovers')

    await trigger.hover()

    await expect.poll(() => hint.matches(':popover-open')).toBe(true)
    expect(getComputedStyle(hint).pointerEvents).toBe('none')

    await trigger.click()

    expect(popup.matches(':popover-open')).toBe(true)
  })

  it('defers mounting its content until it opens', async () => {
    const onMount = vi.fn<() => void>()
    const screen = await render(
      <Popover popoverTitle='Details' showOnInterest trigger='Open details'>
        <MountObserver onMount={onMount} />
      </Popover>,
    )

    expect(onMount).not.toHaveBeenCalled()

    await screen.getByRole('button', { name: 'Open details' }).hover()

    await expect.poll(() => onMount).toHaveBeenCalled()
  })

  it('shows only the hint for the most recently hovered trigger', async () => {
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
    await expect.poll(() => firstHint.matches(':popover-open')).toBe(true)

    await screen.getByRole('button', { name: 'Second' }).hover()

    await expect
      .poll(() => !firstHint.matches(':popover-open') && secondHint.matches(':popover-open'))
      .toBe(true)
  })

  it('outlines and scales the active interest trigger without changing its color', async () => {
    const screen = await render(
      <Popover popoverTitle='Details' showOnInterest trigger='Open details'>
        Popover content
      </Popover>,
    )

    const trigger = screen.getByRole('button', { name: 'Open details' })
    const hint = screen.container.querySelector<HTMLElement>('[popover="hint"]')

    if (!hint) throw new Error('Expected a hint popover')

    const { color } = getComputedStyle(trigger.element())

    await trigger.hover()
    await expect.poll(() => hint.matches(':popover-open')).toBe(true)

    const activeStyle = getComputedStyle(trigger.element())

    expect(activeStyle.color).toBe(color)
    expect(activeStyle.outlineStyle).toBe('solid')
    expect(activeStyle.transform).not.toBe('none')
  })
})
