import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import type { TrainingSession } from '~/schema/training'
import { getSessionsDistributionData } from './get-sessions-distribution-data'

type ChartDatum = { category: string; [key: string]: string | number }
const getCategory = (datum: ChartDatum) => datum.category

export function TrainingSessionsDistribution({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { data, colors } = getSessionsDistributionData(trainingSessions)
  const seen = new Set<string>()
  const series: ChartSeries[] = []
  const chartData = data.map(category => {
    const datum: ChartDatum = { category: category.id }
    for (const point of category.data) {
      datum[point.x] = point.y
      if (!seen.has(point.x)) {
        seen.add(point.x)
        series.push({ key: point.x, label: point.x, color: colors[point.x] ?? 'var(--gray-5)' })
      }
    }
    return datum
  })
  if (chartData.length === 0) return
  return (
    <ChartContainer caption='Session Distribution'>
      <TanStackBarChart
        ariaLabel='Session Distribution'
        data={chartData}
        getCategory={getCategory}
        legend
        orientation='horizontal'
        series={series}
        x={{ label: 'Number of Sessions' }}
      />
    </ChartContainer>
  )
}
