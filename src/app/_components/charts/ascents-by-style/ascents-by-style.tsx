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
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])

  const labelRenderer = useCallback(
    (props: PieLabelRenderProps) => renderPieArcLabel({ props, total: ascents.length }),
    [ascents.length],
  )
  const shapeRenderer = useCallback(
    (props: PieSectorShapeProps) => <Sector {...props} fill={data[props.index]?.color} />,
    [data],
  )

  if (data.length <= 1) return

  return (
    <ChartContainer caption='Ascent By Style'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <ChartTooltip />
          <Pie
            {...DEFAULT_PIE_PROPS}
            data={data}
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
