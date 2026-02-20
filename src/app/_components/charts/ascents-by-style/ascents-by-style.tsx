import { useMemo } from 'react'
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieSectorShapeProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_PROPS, TOOLTIP_STYLE } from '../constants'
import { renderPieArcLabel } from '../pie-chart-utils'

import type { Ascent } from '~/schema/ascent'
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])

  if (data.length <= 1) return

  return (
    <ChartContainer caption='Ascent By Style'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Pie
            {...DEFAULT_PIE_PROPS}
            data={data}
            dataKey='value'
            label={props => renderPieArcLabel({ props, total: ascents.length })}
            nameKey='label'
            shape={(props: PieSectorShapeProps) => (
              <Sector {...props} fill={data[props.index]?.color} />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
