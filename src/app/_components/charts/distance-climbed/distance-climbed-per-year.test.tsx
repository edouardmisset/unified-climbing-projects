import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { DistanceClimbedPerYear } from './distance-climbed-per-year'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

describe('distanceClimbedPerYear', () => {
  it('renders total-distance bars and the average-height line', async () => {
    const data = getDistanceClimbedPerYear(sampleAscents)
    const screen = await render(<DistanceClimbedPerYear ascents={sampleAscents} />)
    const { container } = screen

    expect(data.length).toBeGreaterThan(0)
    await expect.element(screen.getByText('Distance climbed per Year')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__line').length).toBe(1)
  })
})
