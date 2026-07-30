
import {
  createRadialChart,
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

type AscentsByStyleDatum = ReturnType<typeof getAscentsByStyle>[number]

const Chart = createRadialChart<AscentsByStyleDatum, string, string | number>()({
  PieChart,
  Pie,
})

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByStyle(ascents)

  const labelRenderer = (props: PieLabelRenderProps) => renderPieArcLabel({ props, total: ascents.length })
  const shapeRenderer = (props: PieSectorShapeProps) => <Sector {...props} fill={data[props.index]?.color} />

  if (data.length <= 1) return

  return (
    <ChartContainer caption='Ascent By Style'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.PieChart accessibilityLayer={false}>
          <ChartTooltip />
          <Chart.Pie
            {...DEFAULT_PIE_PROPS}
            data={data}
            dataKey='value'
            label={labelRenderer}
            nameKey='label'
            shape={shapeRenderer}
          />
        </Chart.PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
