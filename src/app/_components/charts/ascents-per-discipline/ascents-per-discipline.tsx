import { useMemo, useCallback } from 'react'
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_PROPS, TOOLTIP_STYLE } from '../constants'
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
          <Tooltip contentStyle={TOOLTIP_STYLE} />
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
