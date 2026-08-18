import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'

import type { TrainingSession } from '~/schema/training'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'

type GaugeChartDatum = {
  category: string
  [key: string]: string | number
}
const getCategory = (datum: GaugeChartDatum) => datum.category

export function TrainingSessionsGauge({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { groupData } = getTrainingSessionsGaugeData(trainingSessions)
  const chartData = [
    groupData.reduce<GaugeChartDatum>(
      (datum, group) => {
        datum[group.id] = group.value
        return datum
      },
      { category: 'Sessions' },
    ),
  ]
  const series = groupData.map(({ fill, id, label }) => ({
    color: fill,
    key: id,
    label,
  })) satisfies ChartSeries[]

  if (groupData.length === 0) return

  return (
    <ChartContainer caption='Training Sessions Gauge'>
      <TanStackBarChart
        ariaLabel='Training Sessions Gauge'
        data={chartData}
        getCategory={getCategory}
        orientation='horizontal'
        percentageLabels
        series={series}
        x={{ label: 'Number of Sessions' }}
        y={{ tickFormat: () => '' }}
      />
    </ChartContainer>
  )
}
