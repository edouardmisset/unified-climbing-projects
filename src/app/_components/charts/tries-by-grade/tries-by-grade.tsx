import { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { ChartTooltip, ChartXAxis, ChartYAxis } from '../chart-elements'
import { GRID_STROKE } from '../constants'

import { getTriesByGrade } from './get-tries-by-grade'
import { TriesByGradeTooltip } from './tries-by-grade-tooltip'

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

const DOT_RADIUS = 4
const LINE_STROKE_WIDTH = 2

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

  const dotStyle = useMemo(() => ({ r: DOT_RADIUS }), [])
  const yAxisDomain = useMemo(() => [0, 'dataMax'] as const, [])

  if (series.length === 0 || isFirstTry) return

  return (
    <ChartContainer caption='Tries by Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='grade' labelText={AXIS_LABELS.grades} />
          <ChartYAxis domain={yAxisDomain} labelText={AXIS_LABELS.numberOfTries} />
          <ChartTooltip content={TriesByGradeTooltip} />
          <Legend align='center' iconType='circle' layout='vertical' verticalAlign='top' />
          <Line
            dataKey='min'
            dot={dotStyle}
            name='Min'
            stroke={seriesColors.get('min') ?? 'var(--minTries)'}
            strokeWidth={LINE_STROKE_WIDTH}
            type='natural'
          />
          <Line
            dataKey='average'
            dot={dotStyle}
            name='Average'
            stroke={seriesColors.get('average') ?? 'var(--averageTries)'}
            strokeWidth={LINE_STROKE_WIDTH}
            type='natural'
          />
          <Line
            dataKey='max'
            dot={dotStyle}
            name='Max'
            stroke={seriesColors.get('max') ?? 'var(--maxTries)'}
            strokeWidth={LINE_STROKE_WIDTH}
            type='natural'
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
