import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDisciplinePerGrade } from './ascents-per-discipline-per-grade'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'

describe('ascentsPerDisciplinePerGrade', () => {
  it('renders the grouped discipline bar mark', async () => {
    const data = getAscentsPerDisciplinePerGrade(sampleAscents)
    const screen = await render(<AscentsPerDisciplinePerGrade ascents={sampleAscents} />)
    const { container } = screen

    // Data-level assertions
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(datum => typeof datum.grade === 'string')).toBe(true)
    expect(data.every(datum => typeof datum.Bouldering === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.Sport === 'number')).toBe(true)

    await expect.element(screen.getByText('Ascents per Discipline per Grade')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
