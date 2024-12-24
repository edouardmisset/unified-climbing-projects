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
        margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        colors={({ data }) => data.color}
        arcLabel={data =>
          `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`
        }
        arcLabelsTextColor="var(--surface-1)"
      />
      <legend className="super-center">Routes vs. Boulders</legend>
    </>
  )
}
