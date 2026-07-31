import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsDistribution } from './training-sessions-distribution'
import { getSessionsDistributionData } from './get-sessions-distribution-data'

describe('trainingSessionsDistribution', () => {
  it('renders one bar series per real distinct category', async () => {
    const { data } = getSessionsDistributionData(sampleTrainingSessions)
    const uniqueCategories = new Set(data.flatMap(category => category.data.map(point => point.x)))
    const screen = await render(
      <TrainingSessionsDistribution trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    expect(uniqueCategories.size).toBeGreaterThan(0)
    await expect.element(screen.getByText('Session Distribution')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(uniqueCategories.size)
  })
})
