import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { TrainingSession } from '~/schema/training'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_PIE_MARGIN,
  defaultMotionConfig,
  pieColorsGetter,
  theme,
} from '../constants'
import { getSessionsPerDiscipline } from './get-sessions-per-discipline'

type SessionDisciplineMetric = {
  id: string
  label: string
  value: number
  color: string
}

export function TrainingSessionsPerDiscipline({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = useMemo(
    () => getSessionsPerDiscipline(trainingSessions),
    [trainingSessions],
  )

  const totalSessions = data.reduce((sum, item) => sum + item.value, 0)

  const arcLabel: PropertyAccessor<
    ComputedDatum<SessionDisciplineMetric>,
    string
  > = datum =>
    `${datum.value} (${Math.round((datum.value / totalSessions) * 100)}%)`

  if (data.length === 0) return null
  if (data.length === 1) return null

  return (
    <ChartContainer caption="Training Sessions by Discipline">
      <ResponsivePie
        animate
        arcLabel={arcLabel}
        arcLabelsTextColor="var(--surface-1)"
        colors={pieColorsGetter}
        data={data}
        innerRadius={0.5}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig={defaultMotionConfig}
        theme={theme}
      />
    </ChartContainer>
  )
}
