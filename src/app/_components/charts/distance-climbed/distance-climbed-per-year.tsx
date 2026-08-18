import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackBarChart, TanStackLineChart, type ChartSeries } from '../tanstack-chart'
import { formatNumber } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

type Datum = ReturnType<typeof getDistanceClimbedPerYear>[number]
const getCategory = (datum: Datum) => datum.year
const formatDistance = (value: string | number | Date) =>
  typeof value === 'number' ? formatNumber(value) : String(value)
const DISTANCE_SERIES = [
  { key: 'distance', label: 'Total height', color: 'var(--blue-3)' },
] satisfies ChartSeries[]
const AVERAGE_SERIES = [
  {
    key: 'averageHeight',
    label: 'Average height',
    color: 'var(--flash)',
  },
] satisfies ChartSeries[]

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = getDistanceClimbedPerYear(ascents)
  if (data.length === 0) return
  return (
    <ChartContainer caption='Distance climbed per Year'>
      <TanStackBarChart
        ariaLabel='Total distance climbed per Year'
        data={data}
        getCategory={getCategory}
        height={260}
        series={DISTANCE_SERIES}
        x={{ label: 'Years', tickFormat: formatYearTick }}
        y={{ label: 'Total height', tickFormat: formatDistance }}
      />
      <TanStackLineChart
        ariaLabel='Average height climbed per Year'
        data={data}
        getCategory={getCategory}
        height={180}
        series={AVERAGE_SERIES}
        x={{ label: 'Years', tickFormat: formatYearTick }}
        y={{ label: 'Average height', tickFormat: formatDistance }}
      />
    </ChartContainer>
  )
}
