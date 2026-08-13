import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsPerYear } from './training-sessions-per-year'

describe('trainingSessionsPerYear', () => {
  it('renders the normalized session-category area mark', async () => {
    const screen = await render(
      <TrainingSessionsPerYear trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    await expect.element(screen.getByText('Sessions per Year')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__area').length).toBe(1)
  })
})
