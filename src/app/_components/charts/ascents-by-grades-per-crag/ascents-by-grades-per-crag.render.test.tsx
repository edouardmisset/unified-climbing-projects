import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsByGradesPerCrag } from './ascents-by-grades-per-crag'

describe('ascentsByGradesPerCrag', () => {
  it('renders the per-crag stacked bar mark', async () => {
    const screen = await render(<AscentsByGradesPerCrag ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents By Grades Per Crag')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
