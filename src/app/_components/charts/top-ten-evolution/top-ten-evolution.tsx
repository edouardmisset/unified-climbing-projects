import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackBarChart, TanStackLineChart, type ChartSeries } from '../tanstack-chart'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getTopTenEvolution } from './get-top-ten-evolution'

type Datum = ReturnType<typeof getTopTenEvolution>[number]
const getCategory = (datum: Datum) => datum.year
const COUNT_SERIES = [
  { key: 'Bouldering', label: 'Boulders', color: CLIMBING_DISCIPLINE_TO_COLOR.Bouldering },
  { key: 'Sport', label: 'Routes', color: CLIMBING_DISCIPLINE_TO_COLOR.Sport },
  { key: 'outdoorDays', label: 'Outdoor Days', color: 'var(--outdoor)' },
] satisfies ChartSeries[]
const SCORE_SERIES = [
  { key: 'topTenScore', label: 'Top Ten Score', color: 'var(--flash)' },
] satisfies ChartSeries[]
const formatScore = (value: string | number | Date) =>
  typeof value === 'number' ? frenchNumberFormatter.format(value) : String(value)

export function TopTenEvolution({ ascents }: { ascents: Ascent[] }) {
  const data = getTopTenEvolution(ascents)
  if (data.length === 0) return
  const x = { label: 'Years', tickFormat: formatYearTick }
  return (
    <ChartContainer caption='Top Ten Evolution'>
      <TanStackLineChart
        ariaLabel='Top Ten score evolution'
        data={data}
        getCategory={getCategory}
        height={210}
        series={SCORE_SERIES}
        x={x}
        y={{ label: 'Top Ten Score', tickFormat: formatScore }}
      />
      <TanStackBarChart
        ariaLabel='Ascent and outdoor day evolution'
        data={data}
        getCategory={getCategory}
        height={210}
        legend
        mode='group'
        series={COUNT_SERIES}
        x={x}
        y={{ label: '# Ascents / Days' }}
      />
    </ChartContainer>
  )
}
