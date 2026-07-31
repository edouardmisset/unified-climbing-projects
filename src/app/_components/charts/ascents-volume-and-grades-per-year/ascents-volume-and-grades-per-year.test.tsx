import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsVolumeAndGradesPerYear } from './ascents-volume-and-grades-per-year'

const BAR_SERIES_COUNT = 2 // Bouldering + Sport volume bars
const LINE_SERIES_COUNT = 4 // max/avg grade, per discipline

describe('ascentsVolumeAndGradesPerYear', () => {
  it('renders the volume bars and grade lines', async () => {
    const screen = await render(<AscentsVolumeAndGradesPerYear ascents={sampleAscents} />)
    const { container } = screen

    await expect
      .element(screen.getByText('Ascents Volume and Max / Average Grade Evolution'))
      .toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(BAR_SERIES_COUNT)
    await expect
      .poll(() => container.querySelectorAll('.recharts-line').length)
      .toBe(LINE_SERIES_COUNT)
  })
})
