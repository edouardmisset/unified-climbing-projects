import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { GRADES } from '~/schema/ascent'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsByGradesPerCrag } from './ascents-by-grades-per-crag'

describe('ascentsByGradesPerCrag', () => {
  it('renders one stacked bar series per grade', async () => {
    const screen = await render(<AscentsByGradesPerCrag ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents By Grades Per Crag')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(GRADES.length)
  })
})
