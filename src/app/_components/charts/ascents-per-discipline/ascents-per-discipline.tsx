import { ChartContainer } from '../chart-container/chart-container'
import { TanStackDonutChart } from '../tanstack-chart'
import type { Ascent } from '~/schema/ascent'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

export function AscentsPerDiscipline({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsPerDiscipline(ascents)
  if (data.length <= 1) return
  return (
    <ChartContainer caption='Ascents per Discipline'>
      <TanStackDonutChart ariaLabel='Ascents per Discipline' data={data} />
    </ChartContainer>
  )
}
