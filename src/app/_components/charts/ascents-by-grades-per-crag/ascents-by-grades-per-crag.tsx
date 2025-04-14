import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { type Ascent, _GRADES } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  chartColorGetter,
  defaultBarChartPadding,
  defaultMotionConfig,
  numberOfAscentsAxisBottom,
  theme,
} from '../constants'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

export function AscentsByGradesPerCrag({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  const ascentsByGradesPerCrag = useMemo(
    () => getAscentsByGradesPerCrag(ascents).reverse(),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascents By Grades Per Crag" className={className}>
      <ResponsiveBar
        theme={theme}
        data={ascentsByGradesPerCrag}
        keys={_GRADES}
        indexBy="crag"
        layout="horizontal"
        margin={{ ...DEFAULT_CHART_MARGIN, left: 150, right: 40 }}
        padding={defaultBarChartPadding}
        enableGridX={false}
        enableGridY={false}
        enableTotals
        // @ts-ignore
        colors={chartColorGetter}
        enableLabel={false}
        motionConfig={defaultMotionConfig}
        axisBottom={numberOfAscentsAxisBottom}
      />
    </ChartContainer>
  )
}
