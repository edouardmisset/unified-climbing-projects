import { createRadialChart, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { ChartTooltip } from '../chart-elements'

import type { TrainingSession } from '~/schema/training'
import {
  getTrainingSessionsGaugeData,
  type TrainingSessionsGaugeDatum,
} from './get-training-sessions-gauge-data'

const Chart = createRadialChart<TrainingSessionsGaugeDatum, string, string | number>()({
  PieChart,
  Pie,
})

export function TrainingSessionsGauge({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { groupData, typeData } = getTrainingSessionsGaugeData(trainingSessions)

  if (groupData.length === 0) return

  return (
    <ChartContainer caption='Training Sessions Gauge'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.PieChart accessibilityLayer={false}>
          <ChartTooltip />
          <Chart.Pie
            data={groupData}
            dataKey='value'
            innerRadius='22%'
            nameKey='label'
            outerRadius='48%'
            stroke='var(--surface-3)'
          />
          <Chart.Pie
            data={typeData}
            dataKey='value'
            innerRadius='54%'
            nameKey='label'
            outerRadius='80%'
            stroke='var(--surface-3)'
          />
        </Chart.PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
