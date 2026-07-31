import {
  createRadialChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
} from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { renderPieArcLabel } from '../pie-chart-utils'

import type { TrainingSession } from '~/schema/training'
import { ChartTooltip } from '../chart-elements'
import { DEFAULT_PIE_PROPS } from '../constants'
import { getSessionsIndoorVsOutdoor } from './get-sessions-indoor-vs-outdoor'

type SessionsIndoorVsOutdoorDatum = ReturnType<typeof getSessionsIndoorVsOutdoor>[number]

const Chart = createRadialChart<SessionsIndoorVsOutdoorDatum, string, string | number>()({
  PieChart,
  Pie,
})

export function TrainingSessionsIndoorVsOutdoor({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = getSessionsIndoorVsOutdoor(trainingSessions)

  const totalSessions = data.reduce((sum, item) => sum + item.value, 0)

  const labelRenderer = (props: PieLabelRenderProps) =>
    renderPieArcLabel({ props, total: totalSessions })
  const shapeRenderer = (props: PieSectorShapeProps) => (
    <Sector {...props} fill={data[props.index]?.fill} />
  )
  if (data.length <= 1) return

  return (
    <ChartContainer caption='Indoor vs Outdoor'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.PieChart accessibilityLayer={false}>
          <ChartTooltip />
          <Legend position='top' />
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
