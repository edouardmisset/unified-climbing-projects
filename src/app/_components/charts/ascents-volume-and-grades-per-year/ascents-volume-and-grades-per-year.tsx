import { useMemo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  YAxis,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { ChartTooltip, ChartXAxis } from '../chart-elements'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  formatYearTick,
  GRID_STROKE,
} from '../constants'

import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { fromNumberToGrade } from '~/helpers/grade-converter'
import { GRADE_TO_NUMBER, type Ascent } from '~/schema/ascent'
import { getAscentsVolumeAndGradesPerYear } from './get-ascents-volume-and-grades-per-year'

const AXIS_LABELS = {
  ascents: '# Ascents',
  grades: 'Grades',
  years: 'Years',
}

const CHART_LABELS = {
  avgBoulderGrade: 'Average Boulder Grade',
  avgRouteGrade: 'Average Route Grade',
  boulderAscents: 'Boulders',
  maxBoulderGrade: 'Max Boulder Grade',
  maxRouteGrade: 'Max Route Grade',
  routeAscents: 'Routes',
}

const DISCIPLINE_SHADED_COLORS = {
  Boulder: {
    average: 'color-mix(in oklch, var(--boulder) 65%, white)',
    max: 'color-mix(in oklch, var(--boulder) 70%, black)',
  },
  Route: {
    average: 'color-mix(in oklch, var(--route) 65%, white)',
    max: 'color-mix(in oklch, var(--route) 70%, black)',
  },
} as const

const GRADE_VALUES = Object.values(GRADE_TO_NUMBER)
const MIN_GRADE_NUMBER = Math.min(...GRADE_VALUES)
const MAX_GRADE_NUMBER = Math.max(...GRADE_VALUES)
const GRADE_AXIS_HEADROOM = 1
const HALF_AXIS_POSITION_NUMERATOR = 1
const HALF_AXIS_POSITION_DENOMINATOR = 2
const HALF_AXIS_POSITION = HALF_AXIS_POSITION_NUMERATOR / HALF_AXIS_POSITION_DENOMINATOR

function clampGrade(grade: number): number {
  return Math.min(MAX_GRADE_NUMBER, Math.max(MIN_GRADE_NUMBER, grade))
}

function clampOptionalGrade(grade: number | undefined): number | undefined {
  if (grade === undefined) return undefined
  return clampGrade(grade)
}

function getLowerBoundForHalfAxisStart(minGrade: number, upperBound: number): number {
  return (minGrade - HALF_AXIS_POSITION * upperBound) / (1 - HALF_AXIS_POSITION)
}

const GRADE_TICKS = GRADE_VALUES

const DOTTED_LINE_STROKE = '6 6'
const ASCENTS_AXIS_STEP = 100

function roundUpToStep(value: number, step: number): number {
  return Math.ceil(value / step) * step
}

function formatGradeTick(value: unknown): string {
  if (typeof value !== 'number') return String(value)
  return fromNumberToGrade(clampGrade(Math.round(value)))
}

export function AscentsVolumeAndGradesPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(
    () =>
      getAscentsVolumeAndGradesPerYear(ascents).map(datum => ({
        ...datum,
        avgBoulderGrade: clampOptionalGrade(datum.avgBoulderGrade),
        avgRouteGrade: clampOptionalGrade(datum.avgRouteGrade),
        maxBoulderGrade: clampOptionalGrade(datum.maxBoulderGrade),
        maxRouteGrade: clampOptionalGrade(datum.maxRouteGrade),
      })),
    [ascents],
  )

  const gradeDomain = useMemo<[number, number]>(() => {
    const grades = data.flatMap(datum => [
      datum.avgBoulderGrade,
      datum.avgRouteGrade,
      datum.maxBoulderGrade,
      datum.maxRouteGrade,
    ])

    const minGrade = grades.reduce<number>(
      (min, value) => (typeof value === 'number' ? Math.min(min, value) : min),
      MAX_GRADE_NUMBER,
    )

    const maxGrade = grades.reduce<number>(
      (max, value) => (typeof value === 'number' ? Math.max(max, value) : max),
      MIN_GRADE_NUMBER,
    )

    const upperBound = maxGrade + GRADE_AXIS_HEADROOM
    const lowerBound = getLowerBoundForHalfAxisStart(minGrade, upperBound)

    return [lowerBound, upperBound]
  }, [data])

  const gradeTicks = useMemo(() => {
    const [minDomain, maxDomain] = gradeDomain
    return GRADE_TICKS.filter(tick => tick >= minDomain && tick <= maxDomain)
  }, [gradeDomain])

  const uniqueYearsCount = new Set(data.map(({ year }) => year)).size
  const hasDisciplineData = data.some(({ Boulder, Route }) => Boulder > 0 || Route > 0)

  if (data.length === 0) return
  if (uniqueYearsCount <= 1) return
  if (!hasDisciplineData) return

  return (
    <ChartContainer caption='Ascents Volume and Max / Average Grade Evolution'>
      <ResponsiveContainer height='100%' width='100%'>
        <ComposedChart barCategoryGap={BAR_CATEGORY_GAP} data={data}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='year' labelText={AXIS_LABELS.years} tickFormatter={formatYearTick} />
          <YAxis
            yAxisId='left'
            domain={gradeDomain}
            ticks={gradeTicks}
            label={{
              ...AXIS_LABEL_STYLE,
              angle: -90,
              value: AXIS_LABELS.grades,
            }}
            tick={AXIS_TICK_STYLE}
            tickFormatter={formatGradeTick}
          />
          <YAxis
            yAxisId='right'
            allowDecimals={false}
            domain={[0, dataMax => roundUpToStep(Number(dataMax), ASCENTS_AXIS_STEP)]}
            label={{
              ...AXIS_LABEL_STYLE,
              angle: -90,
              value: AXIS_LABELS.ascents,
            }}
            orientation='right'
            tick={AXIS_TICK_STYLE}
          />
          <ChartTooltip
            formatter={(value, name) => {
              if (typeof value !== 'number') return [value, name]
              if (!name?.toString()?.includes('Grade')) return [value, name]

              return [fromNumberToGrade(clampGrade(Math.round(value))), name]
            }}
          />
          <Legend align='center' iconType='circle' layout='horizontal' verticalAlign='top' />

          <Bar
            dataKey='Boulder'
            fill={CLIMBING_DISCIPLINE_TO_COLOR.Boulder}
            name={CHART_LABELS.boulderAscents}
            yAxisId='right'
          />
          <Bar
            dataKey='Route'
            fill={CLIMBING_DISCIPLINE_TO_COLOR.Route}
            name={CHART_LABELS.routeAscents}
            yAxisId='right'
          />

          <Line
            dataKey='maxBoulderGrade'
            dot={false}
            name={CHART_LABELS.maxBoulderGrade}
            stroke={DISCIPLINE_SHADED_COLORS.Boulder.max}
            strokeWidth={2}
            type='natural'
            yAxisId='left'
          />
          <Line
            dataKey='maxRouteGrade'
            dot={false}
            name={CHART_LABELS.maxRouteGrade}
            stroke={DISCIPLINE_SHADED_COLORS.Route.max}
            strokeWidth={2}
            type='natural'
            yAxisId='left'
          />
          <Line
            dataKey='avgBoulderGrade'
            dot={false}
            name={CHART_LABELS.avgBoulderGrade}
            stroke={DISCIPLINE_SHADED_COLORS.Boulder.average}
            strokeDasharray={DOTTED_LINE_STROKE}
            strokeWidth={2}
            type='natural'
            yAxisId='left'
          />
          <Line
            dataKey='avgRouteGrade'
            dot={false}
            name={CHART_LABELS.avgRouteGrade}
            stroke={DISCIPLINE_SHADED_COLORS.Route.average}
            strokeDasharray={DOTTED_LINE_STROKE}
            strokeWidth={2}
            type='natural'
            yAxisId='left'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
