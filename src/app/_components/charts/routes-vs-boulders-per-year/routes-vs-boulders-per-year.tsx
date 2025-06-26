import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  chartColorGetter,
  DEFAULT_CHART_MARGIN,
  defaultBarChartPadding,
  defaultMotionConfig,
  numberOfAscentsAxisLeft,
  theme,
  yearBottomAxis,
} from '../constants'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

const ROUTE_AND_BOULDER = [
  'Boulder',
  'Route',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

export function RoutesVsBouldersPerYear({
  ascents,
  className,
}: {
  ascents: Ascent[]
  className?: string
}) {
  const data = useMemo(() => getRoutesVsBouldersPerYear(ascents), [ascents])

  return (
    <ChartContainer
      caption="Routes vs. Boulders per Year"
      className={className}
    >
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-ignore
        colors={chartColorGetter}
        data={data}
        enableGridY={false}
        enableLabel={false}
        groupMode="grouped"
        indexBy="year"
        // @ts-ignore
        keys={ROUTE_AND_BOULDER}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
