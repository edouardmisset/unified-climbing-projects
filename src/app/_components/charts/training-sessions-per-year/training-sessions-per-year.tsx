import { ChartContainer } from '../chart-container/chart-container'
import { formatPercentageTick, formatYearTick } from '../constants'
import { TanStackAreaChart, type ChartSeries } from '../tanstack-chart'
import type { TrainingSession } from '~/schema/training'
import { getSessionsPerYear } from './get-sessions-per-year'

type Datum = ReturnType<typeof getSessionsPerYear>[number]
const SERIES = [
  { key: 'indoorRoute', label: 'Indoor Route', color: 'var(--indoorRoute)' },
  { key: 'indoorBoulder', label: 'Indoor Boulder', color: 'var(--indoorBoulder)' },
  { key: 'outdoorRoute', label: 'Outdoor Route', color: 'var(--route)' },
  { key: 'outdoorBoulder', label: 'Outdoor Boulder', color: 'var(--boulder)' },
] satisfies ChartSeries[]
const getCategory = (datum: Datum) => datum.year

export function TrainingSessionsPerYear({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const data = getSessionsPerYear(trainingSessions)
  if (data.length === 0) return
  return (
    <ChartContainer caption='Sessions per Year'>
      <TanStackAreaChart
        ariaLabel='Sessions per Year'
        data={data}
        getCategory={getCategory}
        series={SERIES}
        x={{ label: 'Years', tickFormat: formatYearTick }}
        y={{ tickFormat: formatPercentageTick }}
      />
    </ChartContainer>
  )
}
