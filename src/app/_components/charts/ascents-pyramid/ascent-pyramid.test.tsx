import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentPyramid } from './ascent-pyramid'
import { getGradeFrequencyAndColors } from './get-grade-frequency'

describe('ascentPyramid', () => {
  it('renders the stacked ascent-style bar mark', async () => {
    const data = getGradeFrequencyAndColors(sampleAscents)
    const screen = await render(<AscentPyramid ascents={sampleAscents} />)
    const { container } = screen

    // Data-level assertions
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(datum => typeof datum.grade === 'string')).toBe(true)
    expect(data.every(datum => typeof datum.Onsight === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.Flash === 'number')).toBe(true)
    expect(data.every(datum => typeof datum.Redpoint === 'number')).toBe(true)

    await expect.element(screen.getByText('Ascent Pyramid')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
