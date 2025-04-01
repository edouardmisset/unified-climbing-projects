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
}: { ascents: Ascent[]; className?: string }): React.JSX.Element {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  return (
    <ChartContainer caption="Distance climbed per Year" className={className}>
      <ResponsiveBar
        data={data}
        theme={theme}
        keys={['distance']}
        indexBy="year"
        margin={{ ...DEFAULT_CHART_MARGIN, left: 80 }}
        padding={0}
        enableGridY={false}
        enableLabel={false}
        colors={['var(--blue-3)', 'var(--orange-3)']}
        motionConfig={defaultMotionConfig}
        axisBottom={yearBottomAxis}
        enableTotals={true}
        axisLeft={heightAxisLeft}
      />
    </ChartContainer>
  )
}
