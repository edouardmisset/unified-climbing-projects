import { ResponsivePie } from '@nivo/pie'
import type { Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'
import { getRoutesVsBoulders } from './get-routes-vs-boulders'

export function RoutesVsBoulders({ ascents }: { ascents: Ascent[] }) {
  const routesVsBoulders = getRoutesVsBoulders(ascents)
  return (
    <>
      <ResponsivePie
        data={routesVsBoulders}
        theme={{ ...ascentPyramidTheme }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        colors={({ data }) => data.color}
      />
      <legend className="super-center">Routes vs. Boulders</legend>
    </>
  )
}
