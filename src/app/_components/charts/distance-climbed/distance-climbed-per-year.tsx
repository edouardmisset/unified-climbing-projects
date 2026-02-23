import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick, GRID_STROKE } from '../constants'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'

import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

const AXIS_LABELS = {
  height: 'Height',
  years: 'Years',
}

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  if (data.length === 0) return

  return (
    <ChartContainer caption='Distance climbed per Year'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={0} data={data}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='year' labelText={AXIS_LABELS.years} tickFormatter={formatYearTick} />
          <ChartYAxis labelText={AXIS_LABELS.height} />
          <ChartTooltip />
          <Bar dataKey='distance' fill='var(--blue-3)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
