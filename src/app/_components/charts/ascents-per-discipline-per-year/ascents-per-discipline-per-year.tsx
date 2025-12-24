import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import {
  type Ascent,
  BOULDERING,
  type CLIMBING_DISCIPLINE,
  SPORT,
} from '~/schema/ascent'
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
import { getAscentsPerDisciplinePerYear } from './get-ascents-per-discipline-per-year'

const ROUTE_AND_BOULDER = [
  BOULDERING,
  SPORT,
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

export function AscentsPerDisciplinePerYear({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const ascentsByDisciplinePerYear = useMemo(
    () => getAscentsPerDisciplinePerYear(ascents),
    [ascents],
  )
  if (ascentsByDisciplinePerYear.length <= 1) return null

  const isSingleDiscipline =
    new Set(ascents.map(({ discipline }) => discipline)).size === 1

  if (isSingleDiscipline) return null

  return (
    <ChartContainer caption="Ascents per Discipline per Year">
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-expect-error
        colors={chartColorGetter}
        data={ascentsByDisciplinePerYear}
        enableGridY={false}
        enableLabel={false}
        groupMode="grouped"
        indexBy="year"
        keys={ROUTE_AND_BOULDER}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
