import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsPerDiscipline } from './training-sessions-per-discipline'
import { getSessionsPerDiscipline } from './get-sessions-per-discipline'

describe('trainingSessionsPerDiscipline', () => {
  it('renders one pie slice per real discipline', async () => {
    const data = getSessionsPerDiscipline(sampleTrainingSessions)
    const screen = await render(
      <TrainingSessionsPerDiscipline trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    await expect.element(screen.getByText('Sessions by Discipline')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-pie-sector').length)
      .toBe(data.length)
  })
})
