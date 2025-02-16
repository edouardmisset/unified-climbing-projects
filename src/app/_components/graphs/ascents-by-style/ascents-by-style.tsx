import { ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import { getAscentsByStyle } from '~/app/_components/graphs/ascents-by-style/get-ascents-by-style'
import type { Ascent } from '~/schema/ascent'
import { DEFAULT_PIE_MARGIN, ascentPyramidTheme } from '../constants'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = useMemo(() => getAscentsByStyle(ascents), [ascents])
  return (
    <>
      <ResponsivePie
        data={data}
        theme={ascentPyramidTheme}
        colors={({ data }) => data.color}
        margin={DEFAULT_PIE_MARGIN}
        motionConfig="slow"
        animate={true}
        innerRadius={0.5}
        arcLabel={data =>
          `${data.value} (${Math.round((data.value / ascents.length) * 100)}%)`
        }
        arcLabelsTextColor="var(--surface-1)"
      />
      <legend className="super-center">Ascent By Style</legend>
    </>
  )
}
