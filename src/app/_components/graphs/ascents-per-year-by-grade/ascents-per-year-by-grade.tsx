import { ResponsiveBar } from '@nivo/bar'
import { type Ascent, _GRADES } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

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
        colors={({ id: grade, data }) => data[`${grade}Color`]}
        enableLabel={false}
        motionConfig="slow"
        axisBottom={{
          format: year => `'${year.toString().slice(2)}`,
        }}
      />
      <legend className="super-center">Ascents Per Year By Grade</legend>
    </>
  )
}
