'use client'

import { ResponsiveBar } from '@nivo/bar'
import { getGradeFrequencyAndColors } from '~/app/_components/graphs/ascents-pyramid/get-grade-frequency'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

export function AscentPyramid({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const gradeFrequency = getGradeFrequencyAndColors(ascents)

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
        colors={({ id, data }) => data[`${id}Color`]}
        enableLabel={false}
        motionConfig="slow"
      />
      <legend className="super-center">Pyramid of Ascents</legend>
    </>
  )
}
