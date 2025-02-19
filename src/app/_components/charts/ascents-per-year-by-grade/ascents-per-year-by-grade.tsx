import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { type Ascent, _GRADES } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  axisBottom,
  chartColorGetter,
  theme,
} from '../constants'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = useMemo(
    () => getAscentsPerYearByGrade(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascents Per Year By Grade">
      <ResponsiveBar
        theme={theme}
        data={ascentsPerYearByGrade}
        keys={_GRADES}
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
