import { ResponsiveBar } from '@nivo/bar'
import type { Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

export function RoutesVsBouldersPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = getRoutesVsBouldersPerYear(ascents)
  return (
    <>
      <ResponsiveBar
        data={data}
        theme={ascentPyramidTheme}
        keys={['boulders', 'routes']}
        groupMode="grouped"
        indexBy="year"
        margin={{ bottom: 40, left: 40, top: 20 }}
        padding={0.5}
        enableGridY={false}
        // @ts-ignore
        colors={({ id, data }) => data[`${id}Color`]}
        enableLabel={false}
        motionConfig="slow"
        axisBottom={{
          format: year => `'${year.toString().slice(2)}`,
        }}
      />
      <legend className="super-center">Routes vs. Boulders per Year</legend>
    </>
  )
}
