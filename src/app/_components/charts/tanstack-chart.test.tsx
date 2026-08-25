import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { TanStackBarChart } from './tanstack-chart'

describe('tanStackBarChart', () => {
  it('renders percentage labels for vertical stacked bars', async () => {
    const screen = await render(
      <TanStackBarChart
        ariaLabel='Vertical percentage chart'
        data={[{ category: 'Sessions', flash: 1, onsight: 1 }]}
        getCategory={datum => datum.category}
        percentageLabels
        series={[
          { key: 'flash', color: 'red' },
          { key: 'onsight', color: 'blue' },
        ]}
      />,
    )

    const { container } = screen
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect
      .poll(() =>
        [...container.querySelectorAll('.ts-chart__text text')].map(node => node.textContent),
      )
      .toStrictEqual(['50%', '50%'])
  })
})
