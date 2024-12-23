import { ResponsivePie } from '@nivo/pie'
import { getAscentsByStyle } from '~/app/_components/graphs/ascents-by-style/get-ascents-by-style'
import type { Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByStyle(ascents)
  return (
    <>
      <ResponsivePie
        data={data}
        theme={{ ...ascentPyramidTheme }}
        colors={({ data }) => data.color}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
      />
      <legend className="super-center">Ascent By Style</legend>
    </>
  )
}