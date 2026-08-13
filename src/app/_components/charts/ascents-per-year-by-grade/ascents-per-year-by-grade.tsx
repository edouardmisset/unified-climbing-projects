import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { GRADES, type Ascent } from '~/schema/ascent'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

type Datum = ReturnType<typeof getAscentsPerYearByGrade>[number]
const SERIES = GRADES.map(key => ({
  key,
  color: fromGradeToBackgroundColor(key),
})) satisfies ChartSeries[]
const getCategory = (datum: Datum) => datum.year

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsPerYearByGrade(ascents)
  if (new Set(data.map(({ year }) => year)).size <= 1 || data.length === 0) return
  return (
    <ChartContainer caption='Ascents Per Year By Grade'>
      <TanStackBarChart
        ariaLabel='Ascents Per Year By Grade'
        data={data}
        getCategory={getCategory}
        series={SERIES}
        x={{ label: 'Years', tickFormat: formatYearTick }}
        y={{ label: '# Ascents' }}
      />
    </ChartContainer>
  )
}
