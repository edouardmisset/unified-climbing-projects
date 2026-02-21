import { useMemo } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

  if (chartData.length === 0) return null

  return (
    <ChartContainer caption='Training Sessions Distribution'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={chartData} layout='vertical'>
          <XAxis
            label={{
              value: 'Number of Sessions',
              offset: 20,
              position: 'bottom',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
            type='number'
          />
          <YAxis dataKey='category' tick={AXIS_TICK_STYLE} type='category' width={150} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          <Legend />
          {barConfigs.map(config => (
            <Bar
              key={config.dataKey}
              dataKey={config.dataKey}
              fill={config.color}
              name={config.name}
              stackId='a'
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
