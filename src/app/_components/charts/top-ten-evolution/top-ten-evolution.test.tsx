import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { TopTenEvolution } from './top-ten-evolution'

const BAR_SERIES_COUNT = 3 // Bouldering + Sport (stacked) + outdoorDays
const LINE_SERIES_COUNT = 1 // topTenScore

describe('topTenEvolution', () => {
  it('renders the discipline bars and the score line', async () => {
    const screen = await render(<TopTenEvolution ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Top Ten Evolution')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(BAR_SERIES_COUNT)
    await expect
      .poll(() => container.querySelectorAll('.recharts-line').length)
      .toBe(LINE_SERIES_COUNT)
  })
})
