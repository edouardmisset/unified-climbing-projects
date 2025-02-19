import { type ComputedDatum, ResponsiveBar } from '@nivo/bar'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import { useMemo } from 'react'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import {
  type GradeFrequency,
  getGradeFrequencyAndColors,
} from '../ascents-pyramid/get-grade-frequency'
import { ChartContainer } from '../chart-container/chart-container'
import { theme } from '../constants'

const colors: OrdinalColorScaleConfig<ComputedDatum<GradeFrequency>> = ({
  id,
  data,
}) => String(data[`${id}Color` as keyof typeof data])

export function AscentPyramid({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const gradeFrequency = useMemo(
    () => getGradeFrequencyAndColors(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Ascent Pyramid">
      <ResponsiveBar
        theme={theme}
        data={gradeFrequency}
        keys={ASCENT_STYLE}
        indexBy="grade"
        margin={{ bottom: 40, left: 40, top: 20 }}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={colors}
        enableLabel={false}
        motionConfig="slow"
      />
    </ChartContainer>
  )
}
