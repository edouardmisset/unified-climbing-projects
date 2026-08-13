import { ChartContainer } from '../chart-container/chart-container'
import { TanStackDonutChart } from '../tanstack-chart'
import type { TrainingSession } from '~/schema/training'
import { getSessionsPerDiscipline } from './get-sessions-per-discipline'

export function TrainingSessionsPerDiscipline({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = getSessionsPerDiscipline(trainingSessions).map(item =>
    Object.assign({}, item, { color: item.fill }),
  )
  if (data.length <= 1) return
  return (
    <ChartContainer caption='Sessions by Discipline'>
      <TanStackDonutChart ariaLabel='Sessions by Discipline' data={data} legend />
    </ChartContainer>
  )
}
