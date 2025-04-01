import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import type { CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  chartColorGetter,
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
}: { ascents: Ascent[]; className?: string }) {
  const data = useMemo(() => getRoutesVsBouldersPerYear(ascents), [ascents])

  return (
    <ChartContainer
      caption="Routes vs. Boulders per Year"
      className={className}
    >
      <ResponsiveBar
        data={data}
        theme={theme}
        keys={ROUTE_AND_BOULDER}
        groupMode="grouped"
        indexBy="year"
        margin={DEFAULT_CHART_MARGIN}
        padding={defaultBarChartPadding}
        enableGridY={false}
        // @ts-ignore
        colors={chartColorGetter}
        enableLabel={false}
        motionConfig={defaultMotionConfig}
        axisBottom={yearBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
      />
    </ChartContainer>
  )
}
