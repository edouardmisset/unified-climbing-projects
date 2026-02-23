import { useMemo, useCallback } from 'react'
import {
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
    (props: PieSectorShapeProps) => <Sector {...props} fill={data[props.index]?.color} />,
    [data],
  )

  if (data.length === 0) return
  if (data.length === 1) return

  return (
    <ChartContainer caption='Training Sessions by Discipline'>
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
