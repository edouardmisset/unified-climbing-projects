import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type LabelProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'

import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'

const ROUTE_AND_BOULDER = [
  'Boulder',
  'Route',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

const AXIS_LABELS = {
  grades: 'Grades',
  numberOfAscents: '# Ascents',
}

export function AscentsPerDisciplinePerGrade({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsPerDisciplinePerGrade(ascents), [ascents])

  const isSingleDiscipline =
    data.every(({ Boulder }) => !Boulder) || data.every(({ Route }) => !Route)

  const xAxisLabel = useMemo<LabelProps>(
    () => ({ value: AXIS_LABELS.grades, offset: 20, position: 'bottom', ...AXIS_LABEL_STYLE }),
    [],
  )

  const yAxisLabel = useMemo<LabelProps>(
    () => ({
      value: AXIS_LABELS.numberOfAscents,
      angle: -90,
      position: 'insideLeft',
      ...AXIS_LABEL_STYLE,
    }),
    [],
  )

  if (data.length === 0) return
  if (isSingleDiscipline) return

  return (
    <ChartContainer caption='Ascents per Discipline per Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={data}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey='grade' label={xAxisLabel} tick={AXIS_TICK_STYLE} />
          <YAxis label={yAxisLabel} tick={AXIS_TICK_STYLE} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          {ROUTE_AND_BOULDER.map(key => (
            <Bar key={key} dataKey={key} fill={CLIMBING_DISCIPLINE_TO_COLOR[key]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
