import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackDualAxisChart, type DualAxisSeries } from '../tanstack-chart'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getTopTenEvolution } from './get-top-ten-evolution'

type Datum = ReturnType<typeof getTopTenEvolution>[number]
const getCategory = (datum: Datum) => datum.year
const formatScore = (value: string | number | Date) =>
  typeof value === 'number' ? frenchNumberFormatter.format(value) : String(value)
const COUNT_SERIES = [
  { key: 'Bouldering', label: 'Boulders', color: CLIMBING_DISCIPLINE_TO_COLOR.Bouldering },
  { key: 'Sport', label: 'Routes', color: CLIMBING_DISCIPLINE_TO_COLOR.Sport },
  { key: 'outdoorDays', label: 'Outdoor Days', color: 'var(--outdoor)' },
] satisfies DualAxisSeries[]
const SCORE_SERIES = [
  {
    key: 'topTenScore',
    label: 'Top Ten Score',
    color: 'var(--flash)',
    valueFormat: formatScore,
  },
] satisfies DualAxisSeries[]

export function TopTenEvolution({ ascents }: { ascents: Ascent[] }) {
  const data = getTopTenEvolution(ascents)
  if (data.length === 0) return
  const x = { label: 'Years', tickFormat: formatYearTick }
  return (
    <ChartContainer caption='Top Ten Evolution'>
      <TanStackDualAxisChart
        ariaLabel='Top Ten score, ascent and outdoor day evolution'
        barSeries={COUNT_SERIES}
        data={data}
        getCategory={getCategory}
        left={{ label: '# Ascents / Days' }}
        lineSeries={SCORE_SERIES}
        right={{ label: 'Top Ten Score', tickFormat: formatScore }}
        x={x}
      />
    </ChartContainer>
  )
}
