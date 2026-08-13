import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerYearByGrade } from './ascents-per-year-by-grade'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

describe('ascentsPerYearByGrade', () => {
  it('renders the yearly-grade stacked bar mark', async () => {
    const data = getAscentsPerYearByGrade(sampleAscents)
    const screen = await render(<AscentsPerYearByGrade ascents={sampleAscents} />)
    const { container } = screen

    // Data-level assertions
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(datum => typeof datum.year === 'number')).toBe(true)
    const grades = Object.keys(data[0] ?? {}).filter(
      key => key !== 'year' && !key.includes('Color'),
    )
    expect(grades.length).toBeGreaterThan(0)

    await expect.element(screen.getByText('Ascents Per Year By Grade')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
