import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  axisBottom,
  chartColorGetter,
  theme,
} from '../constants'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

const discipline = ['boulders', 'routes']

export function RoutesVsBouldersPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getRoutesVsBouldersPerYear(ascents), [ascents])

  return (
    <ChartContainer caption="Routes vs. Boulders per Year">
      <ResponsiveBar
        data={data}
        theme={theme}
        keys={discipline}
        groupMode="grouped"
        indexBy="year"
        margin={DEFAULT_CHART_MARGIN}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={chartColorGetter}
        enableLabel={false}
        motionConfig="slow"
        axisBottom={axisBottom}
      />
    </ChartContainer>
  )
}
