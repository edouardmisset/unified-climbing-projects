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
import { renderPieArcLabel } from '../pie-chart-utils'

import type { TrainingSession } from '~/schema/training'
import { ChartTooltip } from '../chart-elements'
import { DEFAULT_PIE_PROPS } from '../constants'
import { getSessionsIndoorVsOutdoor } from './get-sessions-indoor-vs-outdoor'

export function TrainingSessionsIndoorVsOutdoor({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsIndoorVsOutdoor(trainingSessions), [trainingSessions])

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
    <ChartContainer caption='Indoor vs Outdoor Sessions'>
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
