import { useCallback, useMemo } from 'react'
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { ChartTooltip } from '../chart-elements'
import { DEFAULT_PIE_PROPS } from '../constants'
import { renderPieArcLabel } from '../pie-chart-utils'

import type { Ascent } from '~/schema/ascent'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

export function AscentsPerDiscipline({ ascents }: { ascents: Ascent[] }) {
  const routesVsBoulders = useMemo(() => getAscentsPerDiscipline(ascents), [ascents])

  const labelRenderer = useCallback(
    (props: PieLabelRenderProps) => renderPieArcLabel({ props, total: ascents.length }),
    [ascents.length],
  )
  const shapeRenderer = useCallback(
    (props: PieSectorShapeProps) => (
      <Sector {...props} fill={routesVsBoulders[props.index]?.color} />
    ),
    [routesVsBoulders],
  )

  if (routesVsBoulders.length <= 1) return

  return (
    <ChartContainer caption='Ascents per Discipline'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <ChartTooltip />
          <Pie
            {...DEFAULT_PIE_PROPS}
            data={routesVsBoulders}
            dataKey='value'
            label={labelRenderer}
            nameKey='label'
            shape={shapeRenderer}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
