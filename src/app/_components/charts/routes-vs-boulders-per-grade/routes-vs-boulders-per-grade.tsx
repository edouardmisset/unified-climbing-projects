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
  gradesBottomAxis,
  numberOfAscentsAxisLeft,
  theme,
} from '../constants'
import { getRoutesVsBouldersPerGrade } from './get-routes-vs-boulders-per-grade'

const ROUTE_AND_BOULDER = [
  'Boulder',
  'Route',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

export function RoutesVsBouldersPerGrade({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  const data = useMemo(() => getRoutesVsBouldersPerGrade(ascents), [ascents])

  return (
    <ChartContainer
      caption="Routes vs. Boulders per Grade"
      className={className}
    >
      <ResponsiveBar
        data={data}
        theme={theme}
        keys={ROUTE_AND_BOULDER}
        groupMode="grouped"
        indexBy="grade"
        margin={DEFAULT_CHART_MARGIN}
        padding={defaultBarChartPadding}
        enableGridY={false}
        // @ts-ignore
        colors={chartColorGetter}
        enableLabel={false}
        motionConfig={defaultMotionConfig}
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
      />
    </ChartContainer>
  )
}
