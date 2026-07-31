import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsIndoorVsOutdoor } from './training-sessions-indoor-vs-outdoor'
import { getSessionsIndoorVsOutdoor } from './get-sessions-indoor-vs-outdoor'

describe('trainingSessionsIndoorVsOutdoor', () => {
  it('renders one pie slice per real indoor/outdoor category', async () => {
    const data = getSessionsIndoorVsOutdoor(sampleTrainingSessions)
    const screen = await render(
      <TrainingSessionsIndoorVsOutdoor trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    await expect.element(screen.getByText('Indoor vs Outdoor')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-pie-sector').length)
      .toBe(data.length)
  })
})
