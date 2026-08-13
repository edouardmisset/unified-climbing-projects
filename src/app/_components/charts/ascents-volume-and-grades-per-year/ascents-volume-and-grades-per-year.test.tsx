import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsVolumeAndGradesPerYear } from './ascents-volume-and-grades-per-year'

const LINE_SERIES_COUNT = 4

describe('ascentsVolumeAndGradesPerYear', () => {
  it('renders the volume bars and grade lines', async () => {
    const screen = await render(<AscentsVolumeAndGradesPerYear ascents={sampleAscents} />)
    const { container } = screen

    await expect
      .element(screen.getByText('Ascents Volume and Max / Average Grade Evolution'))
      .toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect
      .poll(() => container.querySelectorAll('.ts-chart__line').length)
      .toBe(LINE_SERIES_COUNT)
  })
})
