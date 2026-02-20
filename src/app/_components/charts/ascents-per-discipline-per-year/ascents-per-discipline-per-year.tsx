import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  formatYearTick,
  TOOLTIP_STYLE,
} from '../constants'

import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { getAscentsPerDisciplinePerYear } from './get-ascents-per-discipline-per-year'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'

const ROUTE_AND_BOULDER = [
  'Boulder',
  'Route',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

const AXIS_LABELS = {
  numberOfAscents: '# Ascents',
  years: 'Years',
}

export function AscentsPerDisciplinePerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsPerDisciplinePerYear(ascents), [ascents])

  if (data.length === 0) return null
  const uniqueYearsCount = new Set(data.map(({ year }) => year)).size
  if (uniqueYearsCount <= 1) return null

  const isSingleDiscipline =
    data.every(({ Boulder }) => !Boulder) || data.every(({ Route }) => !Route)

  if (isSingleDiscipline) return null

  return (
    <ChartContainer caption='Ascents per Discipline per Year'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={data}>
          <XAxis
            dataKey='year'
            label={{
              value: AXIS_LABELS.years,
              offset: 20,
              position: 'bottom',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
            tickFormatter={value => formatYearTick(Number(value))}
          />
          <YAxis
            label={{
              value: AXIS_LABELS.numberOfAscents,
              angle: -90,
              position: 'insideLeft',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          {ROUTE_AND_BOULDER.map(key => (
            <Bar key={key} dataKey={key} fill={CLIMBING_DISCIPLINE_TO_COLOR[key]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
