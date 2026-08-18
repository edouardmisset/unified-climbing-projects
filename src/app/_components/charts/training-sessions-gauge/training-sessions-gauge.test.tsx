import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'
import { TrainingSessionsGauge } from './training-sessions-gauge'

describe('trainingSessionsGauge', () => {
  it('renders one stacked horizontal bar with one segment per session type', async () => {
    const { typeData } = getTrainingSessionsGaugeData(sampleTrainingSessions)

    const screen = await render(<TrainingSessionsGauge trainingSessions={sampleTrainingSessions} />)
    const { container } = screen

    await expect.element(screen.getByText('Training Sessions Gauge')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(typeData.length)
  })
})
