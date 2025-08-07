import { type ComputedDatum, ResponsiveBar } from '@nivo/bar'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import { useMemo } from 'react'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import {
  type GradeFrequency,
  getGradeFrequencyAndColors,
} from '../ascents-pyramid/get-grade-frequency'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  defaultBarChartPadding,
  defaultMotionConfig,
  gradesBottomAxis,
  numberOfAscentsAxisLeft,
  theme,
} from '../constants'

const colors: OrdinalColorScaleConfig<ComputedDatum<GradeFrequency>> = ({
  id,
  data,
}) => String(data[`${id}Color` as keyof typeof data])

export function AscentPyramid({ ascents }: { ascents: Ascent[] }) {
  const gradeFrequency = useMemo(
    () => getGradeFrequencyAndColors(ascents),
    [ascents],
  )

  if (gradeFrequency.length === 0) return null

  return (
    <ChartContainer caption="Ascent Pyramid">
      <ResponsiveBar
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        // @ts-ignore
        colors={colors}
        data={gradeFrequency}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy="grade"
        // @ts-ignore
        keys={ASCENT_STYLE}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
