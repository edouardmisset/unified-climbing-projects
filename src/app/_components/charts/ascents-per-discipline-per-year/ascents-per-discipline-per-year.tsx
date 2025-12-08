import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
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
  'Boulder',
  'Route',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

export function AscentsPerDisciplinePerYear({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const data = useMemo(() => getAscentsPerDisciplinePerYear(ascents), [ascents])

  if (data.length === 0) return null
  const uniqueYearsCount = new Set(data.map(({ year }) => year)).size
  if (uniqueYearsCount <= 1) return null

  const isSingleDiscipline =
    data.every(({ Boulder }) => !Boulder) || data.every(({ Route }) => !Route)

  if (isSingleDiscipline) return null

  return (
    <ChartContainer caption="Ascents per Discipline per Year">
      <ResponsiveBar
        axisBottom={yearBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-expect-error
        colors={chartColorGetter}
        data={data}
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
