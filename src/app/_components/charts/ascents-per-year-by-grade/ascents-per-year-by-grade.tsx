import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { _GRADES, type Ascent } from '~/schema/ascent'
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
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

export function AscentsPerYearByGrade({
  ascents,
  className,
}: {
  ascents: Ascent[]
  className?: string
}) {
  const ascentsPerYearByGrade = useMemo(
    () => getAscentsPerYearByGrade(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascents Per Year By Grade" className={className}>
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-ignore
        colors={chartColorGetter}
        data={ascentsPerYearByGrade}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy="year"
        // @ts-ignore
        keys={_GRADES}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
