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
import { renderPieArcLabel } from '../pie-chart-utils'

import type { TrainingSession } from '~/schema/training'
import { getSessionsIndoorVsOutdoor } from './get-sessions-indoor-vs-outdoor'
import { DEFAULT_PIE_PROPS, TOOLTIP_STYLE } from '../constants'

export function TrainingSessionsIndoorVsOutdoor({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(() => getSessionsIndoorVsOutdoor(trainingSessions), [trainingSessions])

  const totalSessions = data.reduce((sum, item) => sum + item.value, 0)

  if (data.length === 0) return
  if (data.length === 1) return

  return (
    <ChartContainer caption='Indoor vs Outdoor Sessions'>
      <ResponsiveContainer height='100%' width='100%'>
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Pie
            {...DEFAULT_PIE_PROPS}
            data={data}
            dataKey='value'
            label={props => renderPieArcLabel({ props, total: totalSessions })}
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
