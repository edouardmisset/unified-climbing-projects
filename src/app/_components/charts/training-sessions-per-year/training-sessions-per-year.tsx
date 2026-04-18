import { useMemo, useCallback } from 'react'
import { Area, AreaChart, CartesianGrid, createHorizontalChart, Legend, ResponsiveContainer } from 'recharts'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'
import type { TrainingSession } from '~/schema/training'
import { ChartContainer } from '../chart-container/chart-container'
import { formatPercentageTick, formatYearTick, GRID_STROKE } from '../constants'
import { getSessionsPerYear } from './get-sessions-per-year'

type SessionsPerYearDatum = ReturnType<typeof getSessionsPerYear>[number]

const Chart = createHorizontalChart<SessionsPerYearDatum>()({
  AreaChart,
  Area,
})

export function TrainingSessionsPerYear({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsPerYear(trainingSessions), [trainingSessions])

  const percentFormatter = useCallback(
    (value: unknown) => (typeof value === 'number' ? `${value}%` : ''),
    [],
  )

  if (data.length === 0) return

  return (
    <ChartContainer caption='Sessions per Year'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.AreaChart accessibilityLayer={false} data={data} stackOffset='expand'>
          <CartesianGrid strokeDasharray='3 3' stroke={GRID_STROKE} opacity={0.3} />
          <ChartXAxis dataKey='year' tickFormatter={formatYearTick} labelText='Years' />
          <ChartYAxis tickFormatter={formatPercentageTick} />
          <ChartTooltip formatter={percentFormatter} />
          <Legend align='center' verticalAlign='top' />
          <Chart.Area
            type='monotone'
            dataKey='indoorRoute'
            stackId='1'
            stroke='var(--indoorRoute)'
            fill='var(--indoorRoute)'
            name='Indoor Route'
          />
          <Chart.Area
            type='monotone'
            dataKey='indoorBoulder'
            stackId='1'
            stroke='var(--indoorBoulder)'
            fill='var(--indoorBoulder)'
            name='Indoor Boulder'
          />
          <Chart.Area
            type='monotone'
            dataKey='outdoorRoute'
            stackId='1'
            stroke='var(--route)'
            fill='var(--route)'
            name='Outdoor Route'
          />
          <Chart.Area
            type='monotone'
            dataKey='outdoorBoulder'
            stackId='1'
            stroke='var(--boulder)'
            fill='var(--boulder)'
            name='Outdoor Boulder'
          />
        </Chart.AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
