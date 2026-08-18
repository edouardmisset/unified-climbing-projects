import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsVolumeAndGradesPerYear } from './ascents-volume-and-grades-per-year'

const LINE_SERIES_COUNT = 4

describe('ascentsVolumeAndGradesPerYear', () => {
  it('renders the volume bars and grade lines', async () => {
    const screen = await render(<AscentsVolumeAndGradesPerYear ascents={sampleAscents} />)
    const { container } = screen

    await expect
      .element(screen.getByText('Ascents Volume and Max / Average Grade Evolution'))
      .toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect
      .poll(() => container.querySelectorAll('.ts-chart__line').length)
      .toBe(LINE_SERIES_COUNT)

    const figure = container.querySelector('figure')
    const chart = container.querySelector('.ts-chart-host')
    expect(figure).not.toBeNull()
    expect(chart).not.toBeNull()
    expect(chart?.getBoundingClientRect().width).toBe(figure?.getBoundingClientRect().width)

    const bar = container.querySelector<SVGGraphicsElement>('.ts-chart__bar rect')
    expect(bar).not.toBeNull()
    const bounds = bar?.getBoundingClientRect()
    bar?.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: (bounds?.left ?? 0) + (bounds?.width ?? 0) / 2,
        clientY: (bounds?.top ?? 0) + (bounds?.height ?? 0) / 2,
      }),
    )
    await expect
      .poll(() => globalThis.document.querySelectorAll('.ts-chart-tooltip__row').length)
      .toBeGreaterThan(0)
  })
})
