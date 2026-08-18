import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'
import { TrainingSessionsGauge } from './training-sessions-gauge'

describe('trainingSessionsGauge', () => {
  it('renders one stacked horizontal bar with a percentage label per session group', async () => {
    const { groupData } = getTrainingSessionsGaugeData(sampleTrainingSessions)
    const screen = await render(<TrainingSessionsGauge trainingSessions={sampleTrainingSessions} />)
    const { container } = screen

    await expect.element(screen.getByText('Training Sessions Gauge')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect
      .poll(() => container.querySelectorAll('.ts-chart__text text').length)
      .toBe(groupData.length)
  })
})
