import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import {
  DEFAULT_PIE_MARGIN,
  ascentPyramidTheme,
  pieColorsGetter,
} from '../constants'
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
    <>
      <ResponsivePie
        data={routesVsBoulders}
        theme={ascentPyramidTheme}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        colors={pieColorsGetter}
        arcLabel={arcLabel}
        arcLabelsTextColor="var(--surface-1)"
      />
      <legend className="super-center">Routes vs. Boulders</legend>
    </>
  )
}
