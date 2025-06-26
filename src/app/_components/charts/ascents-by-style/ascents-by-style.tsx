import { ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'
import { ChartContainer } from '../chart-container/chart-container'
import { DEFAULT_PIE_MARGIN, defaultMotionConfig, theme } from '../constants'

export function AscentsByStyle({
  ascents,
  className,
}: {
  ascents: Ascent[]
  className?: string
}) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])

  if (data.length <= 1) return null

  return (
    <ChartContainer caption="Ascent By Style" className={className}>
      <ResponsivePie
        animate={true}
        arcLabel={data =>
          `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`
        }
        arcLabelsTextColor="var(--surface-1)"
        colors={({ data }) => data.color}
        data={data}
        innerRadius={0.5}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig={defaultMotionConfig}
        theme={theme}
      />
    </ChartContainer>
  )
}
