import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  CURSOR_STYLE,
  formatYearTick,
  TOOLTIP_STYLE,
} from '../constants'

import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

const chartColors = ['var(--blue-3)', 'var(--orange-3)']
const AXIS_LABELS = {
  height: 'Height',
  years: 'Years',
}
const BAR_CATEGORY_GAP = 0

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  if (data.length === 0) return null

  return (
    <ChartContainer caption='Distance climbed per Year'>
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
              value: AXIS_LABELS.height,
              angle: -90,
              position: 'insideLeft',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          <Bar dataKey='distance' fill={chartColors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
