import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  chartColorGetter,
  DEFAULT_CHART_MARGIN,
  defaultBarChartPadding,
  defaultMotionConfig,
  gradesBottomAxis,
  numberOfAscentsAxisLeft,
  theme,
} from '../constants'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'

const ROUTE_AND_BOULDER = [
  'Bouldering',
  'Sport',
] as const satisfies (typeof CLIMBING_DISCIPLINE)[number][]

export function AscentsPerDisciplinePerGrade({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const data = useMemo(
    () => getAscentsPerDisciplinePerGrade(ascents),
    [ascents],
  )

  if (data.length === 0) return null

  const isSingleDiscipline =
    new Set(ascents.map(({ discipline }) => discipline)).size === 1

  if (isSingleDiscipline) return null

  return (
    <ChartContainer caption="Ascents per Discipline per Grade">
      <ResponsiveBar
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-expect-error
        colors={chartColorGetter}
        data={data}
        enableGridY={false}
        enableLabel={false}
        groupMode="grouped"
        indexBy="grade"
        keys={ROUTE_AND_BOULDER}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
