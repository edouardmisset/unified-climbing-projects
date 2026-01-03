import type { LegendProps } from '@nivo/legends'
import { ResponsiveRadialBar } from '@nivo/radial-bar'
import { useCallback, useMemo } from 'react'
import type { TrainingSession } from '~/schema/training'
import { ChartContainer } from '../chart-container/chart-container'
import { theme } from '../constants'
import { getSessionsRadialData } from './get-sessions-radial-data'

export function TrainingSessionsRadial({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const { data, colors, legendData, totals } = useMemo(
    () => getSessionsRadialData(trainingSessions),
    [trainingSessions],
  )

  const getBarColor = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: Idk what to put in there
    ({ data: d }: any) => colors[d.x] ?? 'var(--gray-5)',
    [colors],
  )

  const formatLabel = useCallback(
    (datum: {
      id: string
      groupId: string
      value: number
      stackedValue: number
    }) => {
      const total = totals[datum.groupId]
      if (!total) return '0%'
      const percentage = Math.round((datum.value / total) * 100)
      return `${percentage}%`
    },
    [totals],
  )
  const chartMargins = useMemo(
    () => ({ bottom: 20, left: 75, right: 160, top: 20 }),
    [],
  )

  const legends = useMemo<LegendProps[]>(
    () => [
      {
        anchor: 'right',
        data: legendData,
        direction: 'column',
        itemDirection: 'left-to-right',
        itemHeight: 20,
        itemWidth: 100,
        symbolShape: 'circle',
        symbolSize: 12,
        translateX: 140,
      },
    ],
    [legendData],
  )

  if (data.length === 0) return null
  return (
    <ChartContainer caption="Training Sessions Distribution">
      <ResponsiveRadialBar
        colors={getBarColor}
        data={data}
        enableCircularGrid={true}
        enableLabels
        enableRadialGrid={false}
        enableTracks={false}
        innerRadius={0.3}
        label={formatLabel}
        legends={legends}
        margin={chartMargins}
        padding={0.4}
        theme={theme}
      />
    </ChartContainer>
  )
}
