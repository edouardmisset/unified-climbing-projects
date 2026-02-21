import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { AXIS_LABEL_STYLE, AXIS_TICK_STYLE, GRID_STROKE } from '../constants'

import { TriesByGradeTooltip } from './tries-by-grade-tooltip'
import { getTriesByGrade } from './get-tries-by-grade'

import type { Ascent } from '~/schema/ascent'

export type TriesByGradePoint = {
  x: string
  y: number
}

export type TriesByGradeSeries = {
  color: string
  data: TriesByGradePoint[]
  id: 'min' | 'average' | 'max'
}

type TriesByGradeChartDatum = {
  average: number
  grade: string
  max: number
  min: number
}

const AXIS_LABELS = {
  grades: 'Grades',
  numberOfTries: '# Tries',
}

export function TriesByGrade({ ascents }: { ascents: Ascent[] }) {
  const series = useMemo(() => getTriesByGrade(ascents), [ascents])
  const chartData = useMemo<TriesByGradeChartDatum[]>(() => {
    if (series.length === 0) return []

    const grades = series[0]?.data.map(point => point.x) ?? []

    return grades.map((grade, index) => {
      const datum: TriesByGradeChartDatum = {
        average: 0,
        grade,
        max: 0,
        min: 0,
      }

      for (const serie of series) {
        const value = serie.data[index]?.y ?? 0

        if (serie.id === 'min') datum.min = value
        if (serie.id === 'average') datum.average = value
        if (serie.id === 'max') datum.max = value
      }

      return datum
    })
  }, [series])

  const seriesColors = useMemo(() => {
    const colors = new Map<TriesByGradeSeries['id'], string>()

    for (const serie of series) {
      colors.set(serie.id, serie.color)
    }

    return colors
  }, [series])

  const isFirstTry = series.every(item => item.data.every(point => point.y === 1))

  if (series.length === 0 || isFirstTry) return null

  return (
    <ChartContainer caption='Tries by Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey='grade'
            label={{
              value: AXIS_LABELS.grades,
              offset: 20,
              position: 'bottom',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <YAxis
            domain={[0, 'dataMax']}
            label={{
              value: AXIS_LABELS.numberOfTries,
              angle: -90,
              position: 'insideLeft',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <Tooltip content={TriesByGradeTooltip} />
          <Legend align='center' iconType='circle' layout='vertical' verticalAlign='top' />
          <Line
            dataKey='min'
            dot={{ r: 4 }}
            name='Min'
            stroke={seriesColors.get('min') ?? 'var(--minTries)'}
            strokeWidth={2}
            type='natural'
          />
          <Line
            dataKey='average'
            dot={{ r: 4 }}
            name='Average'
            stroke={seriesColors.get('average') ?? 'var(--averageTries)'}
            strokeWidth={2}
            type='natural'
          />
          <Line
            dataKey='max'
            dot={{ r: 4 }}
            name='Max'
            stroke={seriesColors.get('max') ?? 'var(--maxTries)'}
            strokeWidth={2}
            type='natural'
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
