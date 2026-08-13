import { ChartContainer } from '../chart-container/chart-container'
import { TanStackDonutChart } from '../tanstack-chart'
import type { Ascent } from '~/schema/ascent'
import { getAscentsByStyle } from './get-ascents-by-style'

export function AscentsByStyle({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByStyle(ascents)
  if (data.length <= 1) return
  return (
    <ChartContainer caption='Ascent By Style'>
      <TanStackDonutChart ariaLabel='Ascent By Style' data={data} />
    </ChartContainer>
  )
}
