import { ResponsiveStream } from '@nivo/stream'
import { useCallback, useMemo } from 'react'
import type { TrainingSession } from '~/schema/training'
import { ChartContainer } from '../chart-container/chart-container'
import { defaultMotionConfig, theme } from '../constants'
import type { SessionsPerYear } from './get-sessions-per-year'
import { getSessionsPerYear } from './get-sessions-per-year'

const STREAM_KEYS = [
  'indoorRoute',
  'indoorBoulder',
  'outdoorRoute',
  'outdoorBoulder',
] as const satisfies (keyof SessionsPerYear)[]
const chartMargins = { bottom: 50, left: 60, right: 10, top: 10 }

export function TrainingSessionsPerYear({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsPerYear(trainingSessions), [trainingSessions])

  const axisLeft = useMemo(
    () => ({
      tickSize: 0,
      tickPadding: 0,
      renderTick: () => null,
    }),
    [],
  )

  // Create a mapping of index to year for axis formatting
  const yearsByIndex = useMemo(() => data.map(d => d.year), [data])

  const axisBottom = useMemo(
    () => ({
      format: (index: number | string) => {
        const numericIndex = typeof index === 'number' ? index : Number(index)

        if (!Number.isFinite(numericIndex)) {
          return ''
        }

        if (numericIndex < 0 || numericIndex >= yearsByIndex.length) {
          return ''
        }

        const year = yearsByIndex[numericIndex]
        return year ? `'${String(year).slice(-2)}` : ''
      },
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Years',
      legendOffset: 40,
      legendPosition: 'middle' as const,
    }),
    [yearsByIndex],
  )

  const getSessionColor = useCallback(
    ({ id }: { id: string | number }) => {
      const sampleData = data[0]
      if (!sampleData) return 'var(--gray-5)'
      const key = `${id}Color` as keyof typeof sampleData
      return (sampleData[key] as string) ?? 'var(--gray-5)'
    },
    [data],
  )

  if (data.length === 0) return null

  return (
    <ChartContainer caption='Training Sessions per Year (Indoor/Outdoor by Discipline)'>
      <ResponsiveStream
        animate
        axisBottom={axisBottom}
        axisLeft={axisLeft}
        colors={getSessionColor}
        data={data}
        keys={STREAM_KEYS}
        margin={chartMargins}
        motionConfig={defaultMotionConfig}
        offsetType='expand'
        theme={theme}
      />
    </ChartContainer>
  )
}
