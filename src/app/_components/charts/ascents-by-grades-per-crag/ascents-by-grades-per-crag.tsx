import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { GRADES, type Ascent } from '~/schema/ascent'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

type Datum = ReturnType<typeof getAscentsByGradesPerCrag>[number]
const SERIES = GRADES.map(key => ({
  key,
  color: fromGradeToBackgroundColor(key),
})) satisfies ChartSeries[]
const getCategory = (datum: Datum) => datum.crag ?? 'Unknown crag'

export function AscentsByGradesPerCrag({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsByGradesPerCrag(ascents).toReversed()
  if (data.length === 0 || new Set(data.map(({ crag }) => crag)).size <= 1) return
  return (
    <ChartContainer caption='Ascents By Grades Per Crag'>
      <TanStackBarChart
        ariaLabel='Ascents By Grades Per Crag'
        data={data}
        getCategory={getCategory}
        orientation='horizontal'
        series={SERIES}
        x={{ label: '# Ascents' }}
      />
    </ChartContainer>
  )
}
