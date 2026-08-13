import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsPerDiscipline } from './training-sessions-per-discipline'
import { getSessionsPerDiscipline } from './get-sessions-per-discipline'

describe('trainingSessionsPerDiscipline', () => {
  it('renders the session-discipline donut mark', async () => {
    const data = getSessionsPerDiscipline(sampleTrainingSessions)
    const screen = await render(
      <TrainingSessionsPerDiscipline trainingSessions={sampleTrainingSessions} />,
    )
    const { container } = screen

    await expect.element(screen.getByText('Sessions by Discipline')).toBeInTheDocument()
    expect(data.length).toBeGreaterThan(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__arc').length).toBe(1)
  })
})
