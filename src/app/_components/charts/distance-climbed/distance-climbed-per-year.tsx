import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackDualAxisChart, type DualAxisSeries } from '../tanstack-chart'
import { formatNumber } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { getDistanceClimbedPerYear } from './get-distance-climbed-per-year'

type Datum = ReturnType<typeof getDistanceClimbedPerYear>[number]
const getCategory = (datum: Datum) => datum.year
const formatDistance = (value: string | number | Date) =>
  typeof value === 'number' ? formatNumber(value) : String(value)
const DISTANCE_SERIES = [
  { key: 'distance', label: 'Total height', color: 'var(--blue-3)', valueFormat: formatDistance },
] satisfies DualAxisSeries[]
const AVERAGE_SERIES = [
  {
    key: 'averageHeight',
    label: 'Average height',
    color: 'var(--flash)',
    valueFormat: formatDistance,
  },
] satisfies DualAxisSeries[]

export function DistanceClimbedPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = getDistanceClimbedPerYear(ascents)
  if (data.length === 0) return
  return (
    <ChartContainer caption='Distance climbed per Year'>
      <TanStackDualAxisChart
        ariaLabel='Distance climbed per Year'
        barSeries={DISTANCE_SERIES}
        data={data}
        getCategory={getCategory}
        left={{ label: 'Total height', tickFormat: formatDistance }}
        lineSeries={AVERAGE_SERIES}
        right={{ label: 'Average height', tickFormat: formatDistance }}
        x={{ label: 'Years', tickFormat: formatYearTick }}
      />
    </ChartContainer>
  )
}
