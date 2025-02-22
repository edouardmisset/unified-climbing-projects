import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  chartColorGetter,
  defaultBarChartPadding,
  numberOfAscentsAxisLeft,
  theme,
  yearAxisBottom,
} from '../constants'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

const discipline = ['boulders', 'routes']

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
        keys={discipline}
        groupMode="grouped"
        indexBy="year"
        margin={DEFAULT_CHART_MARGIN}
        padding={defaultBarChartPadding}
        enableGridY={false}
        // @ts-ignore
        colors={chartColorGetter}
        enableLabel={false}
        motionConfig="slow"
        axisBottom={yearAxisBottom}
        axisLeft={numberOfAscentsAxisLeft}
      />
    </ChartContainer>
  )
}
