import { ChartContainer } from '../chart-container/chart-container'
import { TanStackDonutChart } from '../tanstack-chart'
import type { TrainingSession } from '~/schema/training'
import { getSessionsIndoorVsOutdoor } from './get-sessions-indoor-vs-outdoor'

export function TrainingSessionsIndoorVsOutdoor({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = getSessionsIndoorVsOutdoor(trainingSessions).map(item =>
    Object.assign({}, item, { color: item.fill }),
  )
  if (data.length <= 1) return
  return (
    <ChartContainer caption='Indoor vs Outdoor'>
      <TanStackDonutChart ariaLabel='Indoor vs Outdoor' data={data} legend />
    </ChartContainer>
  )
}
