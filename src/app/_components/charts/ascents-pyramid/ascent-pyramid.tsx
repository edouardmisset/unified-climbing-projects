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

export function AscentPyramid({
  ascents,
  className,
}: {
  ascents: Ascent[]
  className?: string
}) {
  const gradeFrequency = useMemo(
    () => getGradeFrequencyAndColors(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascent Pyramid" className={className}>
      <ResponsiveBar
        theme={theme}
        data={gradeFrequency}
        keys={ASCENT_STYLE}
        indexBy="grade"
        margin={DEFAULT_CHART_MARGIN}
        padding={defaultBarChartPadding}
        enableGridY={false}
        // @ts-ignore
        colors={colors}
        enableLabel={false}
        motionConfig={defaultMotionConfig}
        axisLeft={numberOfAscentsAxisLeft}
        axisBottom={gradesBottomAxis}
      />
    </ChartContainer>
  )
}
