import { useMemo, useCallback } from 'react'
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
import { DEFAULT_PIE_PROPS } from '../constants'
import { ChartTooltip } from '../chart-elements'
import { renderPieArcLabel } from '../pie-chart-utils'

import type { TrainingSession } from '~/schema/training'
import { getSessionsPerDiscipline } from './get-sessions-per-discipline'

type SessionsPerDisciplineDatum = ReturnType<typeof getSessionsPerDiscipline>[number]

const Chart = createRadialChart<SessionsPerDisciplineDatum>()({
  PieChart,
  Pie,
})

export function TrainingSessionsPerDiscipline({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsPerDiscipline(trainingSessions), [trainingSessions])

  const totalSessions = data.reduce((sum, item) => sum + item.value, 0)

  const labelRenderer = useCallback(
    (props: PieLabelRenderProps) => renderPieArcLabel({ props, total: totalSessions }),
    [totalSessions],
  )
  const shapeRenderer = useCallback(
    (props: PieSectorShapeProps) => <Sector {...props} fill={data[props.index]?.fill} />,
    [data],
  )

  if (data.length <= 1) return

  return (
    <ChartContainer caption='Sessions by Discipline'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.PieChart accessibilityLayer={false}>
          <ChartTooltip />
          <Legend align='center' verticalAlign='top' />
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
