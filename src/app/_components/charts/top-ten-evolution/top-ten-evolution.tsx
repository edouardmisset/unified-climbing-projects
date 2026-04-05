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
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getTopTenEvolution } from './get-top-ten-evolution'

type TopTenEvolutionDatum = ReturnType<typeof getTopTenEvolution>[number]

const AXIS_LABELS = {
  ascents: '# Ascents',
  boulders: 'Boulders',
  outdoorDays: 'Outdoor Days',
  routes: 'Routes',
  score: 'Top Ten Score',
  years: 'Years',
}

const DOT_STYLE = { r: 4 }

export function TopTenEvolution({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getTopTenEvolution(ascents), [ascents])

  if (data.length === 0) return

  return (
    <ChartContainer caption='Top Ten Evolution'>
      <ResponsiveContainer height='100%' width='100%'>
        <ComposedChart<TopTenEvolutionDatum> barCategoryGap={BAR_CATEGORY_GAP} data={data}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis<TopTenEvolutionDatum, number>
            dataKey='year'
            labelText={AXIS_LABELS.years}
            tickFormatter={formatYearTick}
          />
          <YAxis<TopTenEvolutionDatum, number>
            yAxisId='left'
            label={{
              ...AXIS_LABEL_STYLE,
              angle: -90,
              value: AXIS_LABELS.score,
            }}
            tick={AXIS_TICK_STYLE}
            tickFormatter={value => frenchNumberFormatter.format(Number(value))}
          />
          <YAxis<TopTenEvolutionDatum, number>
            yAxisId='right'
            allowDecimals={false}
            domain={[0, 'dataMax']}
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
              if (name === AXIS_LABELS.score)
                return [frenchNumberFormatter.format(Number(value)), name]
              return [value, name]
            }}
          />
          <Legend align='center' iconType='circle' layout='horizontal' verticalAlign='top' />
          <Bar<TopTenEvolutionDatum, number>
            dataKey='Boulder'
            fill={CLIMBING_DISCIPLINE_TO_COLOR.Boulder}
            name={AXIS_LABELS.boulders}
            stackId='ascents'
            yAxisId='right'
          />
          <Bar<TopTenEvolutionDatum, number>
            dataKey='Route'
            fill={CLIMBING_DISCIPLINE_TO_COLOR.Route}
            name={AXIS_LABELS.routes}
            stackId='ascents'
            yAxisId='right'
          />
          <Bar<TopTenEvolutionDatum, number>
            dataKey='outdoorDays'
            fill='var(--outdoor)'
            name={AXIS_LABELS.outdoorDays}
            yAxisId='right'
          />
          <Line<TopTenEvolutionDatum, number>
            dataKey='topTenScore'
            dot={DOT_STYLE}
            name={AXIS_LABELS.score}
            stroke='var(--flash)'
            strokeWidth={2}
            type='natural'
            yAxisId='left'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
