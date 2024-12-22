import { ResponsivePie } from '@nivo/pie'
import { getAscentsByStyle } from '~/helpers/get-ascents-by-style'
import type { Ascent } from '~/schema/ascent'
import { ascentPyramidTheme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByStyle(ascents)
  return (
    <>
      <ResponsivePie
        data={data}
        theme={{ ...ascentPyramidTheme }}
        colors={['var(--green-4)', 'var(--yellow-4)', 'var(--red-4)']} // the order of the colors matters
        margin={{ bottom: 40, left: 40, top: 20, right: 40 }}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
      />
      <legend className="super-center">Ascent By Style</legend>
    </>
  )
}
