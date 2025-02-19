import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_MARGIN, pieColorsGetter, theme } from '../constants'
import type { ClimbingDisciplineMetric } from '../types'
import { getRoutesVsBoulders } from './get-routes-vs-boulders'

export function RoutesVsBoulders({ ascents }: { ascents: Ascent[] }) {
  const routesVsBoulders = useMemo(
    () => getRoutesVsBoulders(ascents),
    [ascents],
  )

  const arcLabel: PropertyAccessor<
    ComputedDatum<ClimbingDisciplineMetric>,
    string
  > = data =>
    `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`

  return (
    <ChartContainer caption="Routes vs. Boulders">
      <ResponsivePie
        data={routesVsBoulders}
        theme={theme}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        colors={pieColorsGetter}
        arcLabel={arcLabel}
        arcLabelsTextColor="var(--surface-1)"
      />
    </ChartContainer>
  )
}
