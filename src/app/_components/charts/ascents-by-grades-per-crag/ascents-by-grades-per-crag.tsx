import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { _GRADES, type Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  chartColorGetter,
  DEFAULT_CHART_MARGIN,
  defaultBarChartPadding,
  defaultMotionConfig,
  numberOfAscentsAxisBottom,
  theme,
} from '../constants'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

const chartMarginSettings = { ...DEFAULT_CHART_MARGIN, left: 150, right: 40 }

export function AscentsByGradesPerCrag({ ascents }: { ascents: Ascent[] }) {
  const ascentsByGradesPerCrag = useMemo(
    () => getAscentsByGradesPerCrag(ascents).reverse(),
    [ascents],
  )

  if (ascentsByGradesPerCrag.length === 0) return null

  const uniqueCragsCount = new Set(
    ascentsByGradesPerCrag.map(({ crag }) => crag),
  ).size
  if (uniqueCragsCount <= 1) return null

  return (
    <ChartContainer caption="Ascents By Grades Per Crag">
      <ResponsiveBar
        axisBottom={numberOfAscentsAxisBottom}
        // @ts-expect-error
        colors={chartColorGetter}
        data={ascentsByGradesPerCrag}
        enableGridX={false}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy="crag"
        keys={_GRADES}
        layout="horizontal"
        margin={chartMarginSettings}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
