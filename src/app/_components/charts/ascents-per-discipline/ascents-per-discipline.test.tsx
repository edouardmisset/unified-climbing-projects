import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDiscipline } from './ascents-per-discipline'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

describe('ascentsPerDiscipline', () => {
  it('renders the discipline donut mark', async () => {
    const data = getAscentsPerDiscipline(sampleAscents)
    const screen = await render(<AscentsPerDiscipline ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents per Discipline')).toBeInTheDocument()
    expect(data.length).toBeGreaterThan(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__arc').length).toBe(1)
    await expect
      .poll(() => container.querySelectorAll('.ts-chart__radial-text').length)
      .toBeGreaterThan(0)

    const host = container.querySelector('.ts-chart-host')
    const legend = container.querySelector('.ts-chart__legend')
    const swatch = legend?.querySelector('circle')
    const label = legend?.querySelector('text')
    expect(host).not.toBeNull()
    expect(legend).not.toBeNull()
    expect(swatch).not.toBeNull()
    expect(label).not.toBeNull()
    expect(legend?.getBoundingClientRect().top).toBeGreaterThan(
      (host?.getBoundingClientRect().top ?? 0) + (host?.getBoundingClientRect().height ?? 0) / 2,
    )
    if (!host || !legend || !swatch || !label) throw new Error('Expected a complete chart legend')
    const hostCenter = host.getBoundingClientRect().left + host.getBoundingClientRect().width / 2
    const legendCenter =
      legend.getBoundingClientRect().left + legend.getBoundingClientRect().width / 2
    expect(Math.abs(hostCenter - legendCenter)).toBeLessThan(1)
    expect(swatch.getAttribute('r')).toBe('6')
    expect(label.getAttribute('font-size')).toBe('13')
  })
})
