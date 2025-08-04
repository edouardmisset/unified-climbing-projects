import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  defaultMotionConfig,
  heightAxisLeft,
  theme,
  yearBottomAxis,
} from '../constants'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

export function DistanceClimbedPerYear({
  ascents,
  className,
}: {
  ascents: Ascent[]
  className?: string
}) {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  if (data.length === 0) return null

  return (
    <ChartContainer caption="Distance climbed per Year" className={className}>
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={heightAxisLeft}
        colors={['var(--blue-3)', 'var(--orange-3)']}
        data={data}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy="year"
        keys={['distance']}
        margin={{ ...DEFAULT_CHART_MARGIN, left: 80 }}
        motionConfig={defaultMotionConfig}
        padding={0}
        theme={theme}
      />
    </ChartContainer>
  )
}
