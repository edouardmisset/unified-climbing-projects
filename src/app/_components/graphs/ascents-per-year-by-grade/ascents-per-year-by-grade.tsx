import { ResponsiveBar } from '@nivo/bar'
import { getAscentsPerYearByGrade } from '~/helpers/get-ascents-per-year-by-grade'
import { type Ascent, _GRADES } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = getAscentsPerYearByGrade(ascents)

  return (
    <>
      <ResponsiveBar
        theme={ascentPyramidTheme}
        data={ascentsPerYearByGrade}
        keys={_GRADES}
        indexBy="year"
        margin={{ bottom: 40, left: 40, top: 20 }}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={({ id, data }) => data[`${id}Color`]}
        enableLabel={false}
        motionConfig="slow"
      />
      <legend className="super-center">Ascents Per Year By Grade</legend>
    </>
  )
}
