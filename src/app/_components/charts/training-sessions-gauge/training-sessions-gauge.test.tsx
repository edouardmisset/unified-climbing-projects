import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'
import { TrainingSessionsGauge } from './training-sessions-gauge'

describe('trainingSessionsGauge', () => {
  it('renders one sector for each group and grouped session type', async () => {
    const { groupData, typeData } = getTrainingSessionsGaugeData(sampleTrainingSessions)

    const screen = await render(<TrainingSessionsGauge trainingSessions={sampleTrainingSessions} />)
    const { container } = screen

    await expect.element(screen.getByText('Training Sessions Gauge')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-pie-sector').length)
      .toBe(groupData.length + typeData.length)
  })
})
