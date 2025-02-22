import { ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'
import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_MARGIN, theme } from '../constants'

export function AscentsByStyle({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])
  return (
    <ChartContainer caption="Ascent By Style" className={className}>
      <ResponsivePie
        data={data}
        theme={theme}
        colors={({ data }) => data.color}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        arcLabel={data =>
          `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`
        }
        arcLabelsTextColor="var(--surface-1)"
      />
    </ChartContainer>
  )
}
