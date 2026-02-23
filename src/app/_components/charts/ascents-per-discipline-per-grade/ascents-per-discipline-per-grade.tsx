import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { BAR_CATEGORY_GAP, GRID_STROKE } from '../constants'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'

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

  if (data.length === 0) return
  if (isSingleDiscipline) return

  return (
    <ChartContainer caption='Ascents per Discipline per Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={data}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='grade' labelText={AXIS_LABELS.grades} />
          <ChartYAxis labelText={AXIS_LABELS.numberOfAscents} />
          <ChartTooltip />
          {ROUTE_AND_BOULDER.map(key => (
            <Bar key={key} dataKey={key} fill={CLIMBING_DISCIPLINE_TO_COLOR[key]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
