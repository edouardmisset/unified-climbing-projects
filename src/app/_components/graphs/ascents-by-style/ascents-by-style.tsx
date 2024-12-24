import { ResponsivePie } from '@nivo/pie'
import { getAscentsByStyle } from '~/app/_components/graphs/ascents-by-style/get-ascents-by-style'
import type { Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByStyle(ascents)
  const numberOfAscents = ascents.length
  return (
    <>
      <ResponsivePie
        data={data}
        theme={{ ...ascentPyramidTheme }}
        colors={({ data }) => data.color}
        margin={{ top: 20, right: 100, bottom: 20, left: 100 }}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        arcLabel={data =>
          `${data.value} (${Math.round((data.value / numberOfAscents) * 100)}%)`
        }
        arcLabelsTextColor="var(--surface-1)"
      />
      <legend className="super-center">Ascent By Style</legend>
    </>
  )
}
