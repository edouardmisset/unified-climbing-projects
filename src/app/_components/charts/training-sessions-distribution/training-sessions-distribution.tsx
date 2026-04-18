import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  createVerticalChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { AXIS_LABEL_STYLE, AXIS_TICK_STYLE, CURSOR_STYLE, TOOLTIP_STYLE } from '../constants'

import type { TrainingSession } from '~/schema/training'
import { getSessionsDistributionData } from './get-sessions-distribution-data'

const BAR_CATEGORY_GAP = '20%'

type ChartDatum = {
  category: string
  [key: string]: string | number
}

type BarConfig = {
  dataKey: string
  name: string
  color: string
}

const Chart = createVerticalChart<ChartDatum>()({
  BarChart,
  Bar,
  XAxis,
  YAxis,
})

export function TrainingSessionsDistribution({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { data, colors } = useMemo(
    () => getSessionsDistributionData(trainingSessions),
    [trainingSessions],
  )

  const { chartData, barConfigs } = useMemo<{
    chartData: ChartDatum[]
    barConfigs: BarConfig[]
  }>(() => {
    const transformedData: ChartDatum[] = []
    const bars: BarConfig[] = []
    const seenKeys = new Set<string>()

    for (const category of data) {
      const datum: ChartDatum = {
        category: category.id,
      }

      for (const point of category.data) {
        datum[point.x] = point.y

        if (!seenKeys.has(point.x)) {
          seenKeys.add(point.x)
          bars.push({
            color: colors[point.x] ?? 'var(--gray-5)',
            dataKey: point.x,
            name: point.x,
          })
        }
      }

      transformedData.push(datum)
    }

    return { barConfigs: bars, chartData: transformedData }
  }, [data, colors])

  const xAxisLabel = useMemo<LabelProps>(
    () => ({ ...AXIS_LABEL_STYLE, value: 'Number of Sessions', offset: 20, position: 'bottom' }),
    [],
  )

  if (chartData.length === 0) return
  return (
    <ChartContainer caption='Session Distribution'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.BarChart
          accessibilityLayer={false}
          barCategoryGap={BAR_CATEGORY_GAP}
          data={chartData}
        >
          <Chart.XAxis label={xAxisLabel} tick={AXIS_TICK_STYLE} type='number' />
          <Chart.YAxis dataKey='category' tick={AXIS_TICK_STYLE} type='category' width={150} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} trigger='click' />
          <Legend align='center' verticalAlign='top' />
          {barConfigs.map(config => (
            <Chart.Bar
              key={config.dataKey}
              dataKey={config.dataKey}
              fill={config.color}
              name={config.name}
              stackId='a'
            />
          ))}
        </Chart.BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
