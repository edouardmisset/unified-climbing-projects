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

const chartColors = ['var(--blue-3)', 'var(--orange-3)']
const keys = ['distance']
const adjustedChartMargin = { ...DEFAULT_CHART_MARGIN, left: 80 }

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getDistanceClimbedPerYear(ascents), [ascents])

  if (data.length === 0) return null

  return (
    <ChartContainer caption="Distance climbed per Year">
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={heightAxisLeft}
        colors={chartColors}
        data={data}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy="year"
        keys={keys}
        margin={adjustedChartMargin}
        motionConfig={defaultMotionConfig}
        padding={0}
        theme={theme}
      />
    </ChartContainer>
  )
}
