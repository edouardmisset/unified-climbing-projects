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

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = useMemo(
    () => getAscentsPerYearByGrade(ascents),
    [ascents],
  )

  if (ascentsPerYearByGrade.length === 0) return null
  const uniqueYearsCount = new Set(
    ascentsPerYearByGrade.map(({ year }) => year),
  ).size
  if (uniqueYearsCount <= 1) return null

  return (
    <ChartContainer caption="Ascents Per Year By Grade">
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
