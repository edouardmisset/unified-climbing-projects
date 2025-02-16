import { ResponsiveBar } from '@nivo/bar'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import {
  DEFAULT_GRAPH_MARGIN,
  ascentPyramidTheme,
  axisBottom,
  graphColorGetter,
} from '../constants'
import { getRoutesVsBouldersPerYear } from './get-routes-vs-boulders-per-year'

const discipline = ['boulders', 'routes']

export function RoutesVsBouldersPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getRoutesVsBouldersPerYear(ascents), [ascents])

  return (
    <>
      <ResponsiveBar
        data={data}
        theme={ascentPyramidTheme}
        keys={discipline}
        groupMode="grouped"
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
      <legend className="super-center">Routes vs. Boulders per Year</legend>
    </>
  )
}
