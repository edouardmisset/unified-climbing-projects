import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  CURSOR_STYLE,
  formatYearTick,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'

import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

const AXIS_LABELS = {
  height: 'Height',
  years: 'Years',
}

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  if (data.length === 0) return null

  return (
    <ChartContainer caption='Distance climbed per Year'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={0} data={data}>
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
              value: AXIS_LABELS.height,
              angle: -90,
              position: 'insideLeft',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          <Bar dataKey='distance' fill='var(--blue-3)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
