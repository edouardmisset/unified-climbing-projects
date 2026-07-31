import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { ASCENT_STYLE } from '~/schema/ascent'
import { sampleAscents } from '~/testing/sample-data'
import { AscentPyramid } from './ascent-pyramid'
import { getGradeFrequencyAndColors } from './get-grade-frequency'

describe('ascentPyramid', () => {
  it('renders one stacked bar series per ascent style', async () => {
    const data = getGradeFrequencyAndColors(sampleAscents)
    const screen = await render(<AscentPyramid ascents={sampleAscents} />)
    const { container } = screen

    expect(data.length).toBeGreaterThan(0)
    await expect.element(screen.getByText('Ascent Pyramid')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(ASCENT_STYLE.length)
  })
})
