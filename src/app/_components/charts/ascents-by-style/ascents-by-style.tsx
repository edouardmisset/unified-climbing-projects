import type { OrdinalColorScaleConfig } from '@nivo/colors'
import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import {
  type AscentByStyle,
  getAscentsByStyle,
} from '../ascents-by-style/get-ascents-by-style'
import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_MARGIN, defaultMotionConfig, theme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])

  const arcLabel: PropertyAccessor<
    ComputedDatum<AscentByStyle>,
    string
  > = data =>
    `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`

  if (data.length <= 1) return null

  return (
    <ChartContainer caption="Ascent By Style">
      <ResponsivePie
        animate
        arcLabel={arcLabel}
        arcLabelsTextColor="var(--surface-1)"
        colors={getChartColor}
        data={data}
        innerRadius={0.5}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig={defaultMotionConfig}
        theme={theme}
      />
    </ChartContainer>
  )
}

const getChartColor: OrdinalColorScaleConfig<
  Omit<ComputedDatum<AscentByStyle>, 'color' | 'fill' | 'arc'>
> = ({ data }) => data.color
