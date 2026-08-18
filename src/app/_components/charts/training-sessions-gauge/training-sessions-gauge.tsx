import { Bar, BarChart, createVerticalChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { ChartTooltip } from '../chart-elements'

import type { TrainingSession } from '~/schema/training'
import { getTrainingSessionsGaugeData } from './get-training-sessions-gauge-data'

type GaugeChartDatum = {
  category: string
  [key: string]: string | number
}

const Chart = createVerticalChart<GaugeChartDatum>()({
  BarChart,
  Bar,
  XAxis,
  YAxis,
})

export function TrainingSessionsGauge({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { typeData } = getTrainingSessionsGaugeData(trainingSessions)
  const chartData = [
    typeData.reduce<GaugeChartDatum>(
      (datum, group) => {
        datum[group.id] = group.value
        return datum
      },
      { category: 'Sessions' },
    ),
  ]

  if (typeData.length === 0) return

  return (
    <ChartContainer caption='Training Sessions Gauge'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.BarChart accessibilityLayer={false} data={chartData} layout='vertical'>
          <ChartTooltip />
          <Chart.XAxis type='number' />
          <Chart.YAxis dataKey='category' hide type='category' />
          {typeData.map(({ fill, id, label }) => (
            <Chart.Bar key={id} dataKey={id} fill={fill} name={label} stackId='sessions' />
          ))}
        </Chart.BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
