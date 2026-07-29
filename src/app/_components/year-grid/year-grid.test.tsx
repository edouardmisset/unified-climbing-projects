import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { YearGrid } from './year-grid'

describe('year grid', () => {
  it('focuses and centers today when the displayed year contains it', () => {
    const scrollIntoView = vi.fn<() => void>()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    const today = new Date()
    today.setHours(12, 0, 0, 0)

    const { container } = render(
      <YearGrid
        dayCollection={[
          {
            date: today.toISOString(),
            shortText: '',
            title: 'Today',
          },
        ]}
        year={today.getFullYear()}
      />,
    )

    const todayCell = container.querySelector<HTMLElement>('[data-today="true"]')

    expect(todayCell).toHaveFocus()
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  })

  it('does not move focus when the displayed year does not contain today', () => {
    const scrollIntoView = vi.fn<() => void>()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    const previousYear = new Date().getFullYear() - 1

    render(
      <YearGrid
        dayCollection={[
          {
            date: `${previousYear}-01-01T12:00:00.000Z`,
            shortText: '',
            title: 'Past date',
          },
        ]}
        year={previousYear}
      />,
    )

    expect(document.body).toHaveFocus()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })
})
