import type { PropertyAccessor } from '@nivo/core'
import { type ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { type AscentByStyle, getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'
import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_MARGIN, defaultMotionConfig, pieColorsGetter, theme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])

  const arcLabel: PropertyAccessor<ComputedDatum<AscentByStyle>, string> = datum =>
    `${datum.value} (${Math.round((datum.value / ascents.length) * 100)}%)`

  if (data.length <= 1) return null

  return (
    <ChartContainer caption='Ascent By Style'>
      <ResponsivePie
        animate
        arcLabel={arcLabel}
        arcLabelsTextColor='var(--surface-1)'
        // @ts-expect-error
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
