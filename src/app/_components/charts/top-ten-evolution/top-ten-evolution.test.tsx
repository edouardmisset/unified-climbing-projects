import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { TopTenEvolution } from './top-ten-evolution'
import { getTopTenEvolution } from './get-top-ten-evolution'

describe('topTenEvolution', () => {
  it('renders the discipline bars and the score line', async () => {
    const data = getTopTenEvolution(sampleAscents)
    const screen = await render(<TopTenEvolution ascents={sampleAscents} />)
    const { container } = screen

    // Data-level assertions
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(datum => typeof datum.year === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.Bouldering === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.Sport === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.outdoorDays === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.topTenScore === 'number')).toBe(true)

    await expect.element(screen.getByText('Top Ten Evolution')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__line').length).toBe(1)
  })
})
