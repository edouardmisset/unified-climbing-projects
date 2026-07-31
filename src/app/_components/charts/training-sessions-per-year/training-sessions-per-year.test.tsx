import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsPerYear } from './training-sessions-per-year'

const AREA_SERIES_COUNT = 4 // indoorRoute, indoorBoulder, outdoorRoute, outdoorBoulder

describe('trainingSessionsPerYear', () => {
  it('renders one stacked area per session category', async () => {
    const screen = await render(
      <TrainingSessionsPerYear trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    await expect.element(screen.getByText('Sessions per Year')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-area').length)
      .toBe(AREA_SERIES_COUNT)
  })
})
