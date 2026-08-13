import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackBarChart } from '../tanstack-chart'
import { formatNumber } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

type Datum = ReturnType<typeof getDistanceClimbedPerYear>[number]
const SERIES = [{ key: 'distance', color: 'var(--blue-3)' }]
const getCategory = (datum: Datum) => datum.year
const formatDistance = (value: string | number | Date) =>
  typeof value === 'number' ? formatNumber(value) : String(value)

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = getDistanceClimbedPerYear(ascents)
  if (data.length === 0) return
  return (
    <ChartContainer caption='Distance climbed per Year'>
      <TanStackBarChart
        ariaLabel='Distance climbed per Year'
        data={data}
        getCategory={getCategory}
        series={SERIES}
        x={{ label: 'Years', tickFormat: formatYearTick }}
        y={{ label: 'Height', tickFormat: formatDistance }}
      />
    </ChartContainer>
  )
}
