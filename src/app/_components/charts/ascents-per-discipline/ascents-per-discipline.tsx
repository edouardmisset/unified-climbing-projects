import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_PIE_MARGIN,
  defaultMotionConfig,
  pieColorsGetter,
  theme,
} from '../constants'
import type { ClimbingDisciplineMetric } from '../types'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

export function AscentsPerDiscipline({ ascents }: { ascents: Ascent[] }) {
  const routesVsBoulders = useMemo(
    () => getAscentsPerDiscipline(ascents),
    [ascents],
  )

  const arcLabel: PropertyAccessor<
    ComputedDatum<ClimbingDisciplineMetric>,
    string
  > = data =>
    `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`

  // If there are no ascents, we don't want to render the chart.
  // If there is only one discipline, we don't want to render the chart.
  if (routesVsBoulders.length <= 1) return null

  return (
    <ChartContainer caption="Ascents per Discipline">
      <ResponsivePie
        animate
        arcLabel={arcLabel}
        arcLabelsTextColor="var(--surface-1)"
        colors={pieColorsGetter}
        data={routesVsBoulders}
        innerRadius={0.5}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig={defaultMotionConfig}
        theme={theme}
      />
    </ChartContainer>
  )
}
