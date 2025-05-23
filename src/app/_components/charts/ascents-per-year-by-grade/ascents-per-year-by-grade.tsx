import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { type Ascent, _GRADES } from '~/schema/ascent'
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
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

export function AscentsPerYearByGrade({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  const ascentsPerYearByGrade = useMemo(
    () => getAscentsPerYearByGrade(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascents Per Year By Grade" className={className}>
      <ResponsiveBar
        theme={theme}
        data={ascentsPerYearByGrade}
        keys={_GRADES}
        indexBy="year"
        margin={DEFAULT_CHART_MARGIN}
        padding={defaultBarChartPadding}
        enableGridY={false}
        enableTotals
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
