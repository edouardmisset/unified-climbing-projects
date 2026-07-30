
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
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

type AscentsPerDisciplineDatum = ReturnType<typeof getAscentsPerDiscipline>[number]

const Chart = createRadialChart<AscentsPerDisciplineDatum, string, string | number>()({
  PieChart,
  Pie,
})

export function AscentsPerDiscipline({ ascents }: { ascents: Ascent[] }) {
  const routesVsBoulders = getAscentsPerDiscipline(ascents)

  const labelRenderer = (props: PieLabelRenderProps) => renderPieArcLabel({ props, total: ascents.length })
  const shapeRenderer = (props: PieSectorShapeProps) => (
      <Sector {...props} fill={routesVsBoulders[props.index]?.color} />
    )

  if (routesVsBoulders.length <= 1) return

  return (
    <ChartContainer caption='Ascents per Discipline'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.PieChart accessibilityLayer={false}>
          <ChartTooltip />
          <Chart.Pie
            {...DEFAULT_PIE_PROPS}
            data={routesVsBoulders}
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
