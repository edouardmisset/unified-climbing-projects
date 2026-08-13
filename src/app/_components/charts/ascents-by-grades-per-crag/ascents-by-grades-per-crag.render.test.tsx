import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsByGradesPerCrag } from './ascents-by-grades-per-crag'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

describe('ascentsByGradesPerCrag', () => {
  it('renders the per-crag stacked bar mark', async () => {
    const data = getAscentsByGradesPerCrag(sampleAscents)
    const screen = await render(<AscentsByGradesPerCrag ascents={sampleAscents} />)
    const { container } = screen

    // Data-level assertions
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(datum => typeof datum.crag === 'string')).toBe(true)
    const grades = Object.keys(data[0] ?? {}).filter(key => key !== 'crag')
    expect(grades.length).toBeGreaterThan(0)

    await expect.element(screen.getByText('Ascents By Grades Per Crag')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
