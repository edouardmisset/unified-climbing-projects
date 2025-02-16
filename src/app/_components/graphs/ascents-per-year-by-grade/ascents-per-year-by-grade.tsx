import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import { type Ascent, _GRADES } from '~/schema/ascent'
import {
  DEFAULT_GRAPH_MARGIN,
  ascentPyramidTheme,
  axisBottom,
  graphColorGetter,
} from '../constants'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = useMemo(
    () => getAscentsPerYearByGrade(ascents),
    [ascents],
  )

  return (
    <>
      <ResponsiveBar
        theme={ascentPyramidTheme}
        data={ascentsPerYearByGrade}
        keys={_GRADES}
        indexBy="year"
        margin={DEFAULT_GRAPH_MARGIN}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={graphColorGetter}
        enableLabel={false}
        motionConfig="slow"
        axisBottom={axisBottom}
      />
      <legend className="super-center">Ascents Per Year By Grade</legend>
    </>
  )
}
