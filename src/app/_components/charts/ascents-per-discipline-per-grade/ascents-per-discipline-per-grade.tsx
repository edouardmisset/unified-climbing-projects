import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import type { Ascent } from '~/schema/ascent'
import { getAscentsPerDisciplinePerGrade } from './get-ascents-per-discipline-per-grade'

type Datum = ReturnType<typeof getAscentsPerDisciplinePerGrade>[number]
const SERIES = ['Bouldering', 'Sport'].map(key => ({
  key,
  color: CLIMBING_DISCIPLINE_TO_COLOR[key as 'Bouldering' | 'Sport'],
})) satisfies ChartSeries[]
const getCategory = (datum: Datum) => datum.grade

export function AscentsPerDisciplinePerGrade({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsPerDisciplinePerGrade(ascents)
  const isSingle = data.every(({ Bouldering }) => !Bouldering) || data.every(({ Sport }) => !Sport)
  if (data.length === 0 || isSingle) return
  return (
    <ChartContainer caption='Ascents per Discipline per Grade'>
      <TanStackBarChart
        ariaLabel='Ascents per Discipline per Grade'
        data={data}
        getCategory={getCategory}
        legend
        mode='group'
        series={SERIES}
        x={{ label: 'Grades' }}
        y={{ label: '# Ascents' }}
      />
    </ChartContainer>
  )
}
