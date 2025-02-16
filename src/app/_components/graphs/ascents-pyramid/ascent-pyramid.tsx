import { type ComputedDatum, ResponsiveBar } from '@nivo/bar'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import { useMemo } from 'react'
import {
  type GradeFrequency,
  getGradeFrequencyAndColors,
} from '~/app/_components/graphs/ascents-pyramid/get-grade-frequency'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

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
    <>
      <ResponsiveBar
        theme={ascentPyramidTheme}
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
      <legend className="super-center">Pyramid of Ascents</legend>
    </>
  )
}
