import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  chartColorGetter,
  DEFAULT_CHART_MARGIN,
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
}: {
  ascents: Ascent[]
  className?: string
}) {
  const data = useMemo(() => getRoutesVsBouldersPerGrade(ascents), [ascents])

  return (
    <ChartContainer
      caption="Routes vs. Boulders per Grade"
      className={className}
    >
      <ResponsiveBar
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-ignore
        colors={chartColorGetter}
        data={data}
        enableGridY={false}
        enableLabel={false}
        groupMode="grouped"
        indexBy="grade"
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
