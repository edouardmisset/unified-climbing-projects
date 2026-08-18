import { ChartContainer } from '../chart-container/chart-container'
import { formatYearTick } from '../constants'
import { TanStackBarChart, TanStackLineChart, type ChartSeries } from '../tanstack-chart'
import { CLIMBING_DISCIPLINE_TO_COLOR } from '~/constants/ascents'
import { fromNumberToGrade } from '~/helpers/grade-converter'
import { GRADE_TO_NUMBER, type Ascent } from '~/schema/ascent'
import { getAscentsVolumeAndGradesPerYear } from './get-ascents-volume-and-grades-per-year'

type Datum = ReturnType<typeof getAscentsVolumeAndGradesPerYear>[number]
const GRADE_VALUES = Object.values(GRADE_TO_NUMBER)
const MIN_GRADE = Math.min(...GRADE_VALUES)
const MAX_GRADE = Math.max(...GRADE_VALUES)
const getCategory = (datum: Datum) => datum.year
const clampGrade = (grade: number) => Math.min(MAX_GRADE, Math.max(MIN_GRADE, grade))
const formatGrade = (value: string | number | Date) =>
  typeof value === 'number' ? fromNumberToGrade(clampGrade(Math.round(value))) : String(value)
const VOLUME_SERIES = [
  { key: 'Bouldering', label: 'Boulders', color: CLIMBING_DISCIPLINE_TO_COLOR.Bouldering },
  { key: 'Sport', label: 'Routes', color: CLIMBING_DISCIPLINE_TO_COLOR.Sport },
] satisfies ChartSeries[]
const GRADE_SERIES = [
  {
    key: 'maxBoulderGrade',
    label: 'Max Bouldering Grade',
    color: 'color-mix(in oklch, var(--boulder) 70%, black)',
  },
  {
    key: 'maxRouteGrade',
    label: 'Max Route Grade',
    color: 'color-mix(in oklch, var(--route) 70%, black)',
  },
  {
    key: 'avgBoulderGrade',
    label: 'Average Bouldering Grade',
    color: 'color-mix(in oklch, var(--boulder) 65%, white)',
  },
  {
    key: 'avgRouteGrade',
    label: 'Average Route Grade',
    color: 'color-mix(in oklch, var(--route) 65%, white)',
  },
] satisfies ChartSeries[]

export function AscentsVolumeAndGradesPerYear({ ascents }: { ascents: Ascent[] }) {
  const data = getAscentsVolumeAndGradesPerYear(ascents)
  if (
    data.length === 0 ||
    new Set(data.map(({ year }) => year)).size <= 1 ||
    !data.some(({ Bouldering, Sport }) => Bouldering > 0 || Sport > 0)
  )
    return
  const x = { label: 'Years', tickFormat: formatYearTick }
  return (
    <ChartContainer caption='Ascents Volume and Max / Average Grade Evolution'>
      <TanStackLineChart
        ariaLabel='Maximum and average grade evolution'
        data={data}
        getCategory={getCategory}
        height={230}
        series={GRADE_SERIES}
        x={x}
        y={{ label: 'Grades', tickFormat: formatGrade }}
      />
      <TanStackBarChart
        ariaLabel='Ascent volume per year'
        data={data}
        getCategory={getCategory}
        height={190}
        legend
        mode='group'
        series={VOLUME_SERIES}
        x={x}
        y={{ label: '# Ascents' }}
      />
    </ChartContainer>
  )
}
