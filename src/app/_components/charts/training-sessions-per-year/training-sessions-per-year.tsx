import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrainingSession } from '~/schema/training'
import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  formatPercentageTick,
  formatYearTick,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'
import { getSessionsPerYear } from './get-sessions-per-year'

export function TrainingSessionsPerYear({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsPerYear(trainingSessions), [trainingSessions])

  if (data.length === 0) return null

  return (
    <ChartContainer caption='Training Sessions per Year (Indoor/Outdoor by Discipline)'>
      <ResponsiveContainer height='100%' width='100%'>
        <AreaChart data={data} stackOffset='expand'>
          <CartesianGrid strokeDasharray='3 3' stroke={GRID_STROKE} opacity={0.3} />
          <XAxis
            dataKey='year'
            tickFormatter={formatYearTick}
            label={{
              value: 'Years',
              position: 'bottom',
              offset: 20,
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <YAxis tickFormatter={formatPercentageTick} tick={AXIS_TICK_STYLE} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => `${value}%`} />
          <Legend />
          <Area
            type='monotone'
            dataKey='indoorRoute'
            stackId='1'
            stroke='var(--indoorRoute)'
            fill='var(--indoorRoute)'
            name='Indoor Route'
          />
          <Area
            type='monotone'
            dataKey='indoorBoulder'
            stackId='1'
            stroke='var(--indoorBoulder)'
            fill='var(--indoorBoulder)'
            name='Indoor Boulder'
          />
          <Area
            type='monotone'
            dataKey='outdoorRoute'
            stackId='1'
            stroke='var(--route)'
            fill='var(--route)'
            name='Outdoor Route'
          />
          <Area
            type='monotone'
            dataKey='outdoorBoulder'
            stackId='1'
            stroke='var(--boulder)'
            fill='var(--boulder)'
            name='Outdoor Boulder'
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
