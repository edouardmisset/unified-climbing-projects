import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { GRADES } from '~/schema/ascent'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerYearByGrade } from './ascents-per-year-by-grade'

describe('ascentsPerYearByGrade', () => {
  it('renders one stacked bar series per grade', async () => {
    const screen = await render(<AscentsPerYearByGrade ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents Per Year By Grade')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(GRADES.length)
  })
})
