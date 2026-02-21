import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  formatYearTick,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'

import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { _GRADES, type Ascent } from '~/schema/ascent'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

const AXIS_LABELS = {
  numberOfAscents: '# Ascents',
  years: 'Years',
}

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = useMemo(() => getAscentsPerYearByGrade(ascents), [ascents])

  if (ascentsPerYearByGrade.length === 0) return null
  const uniqueYearsCount = new Set(ascentsPerYearByGrade.map(({ year }) => year)).size
  if (uniqueYearsCount <= 1) return null

  return (
    <ChartContainer caption='Ascents Per Year By Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={ascentsPerYearByGrade}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey='year'
            label={{
              value: AXIS_LABELS.years,
              offset: 20,
              position: 'bottom',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
            tickFormatter={formatYearTick}
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
          {_GRADES.map(key => (
            <Bar key={key} dataKey={key} fill={fromGradeToBackgroundColor(key)} stackId='grades' />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
