import { ChartContainer } from '../chart-container/chart-container'
import { TanStackLineChart, type ChartSeries } from '../tanstack-chart'
import type { Ascent } from '~/schema/ascent'
import { getTriesByGrade } from './get-tries-by-grade'

export type TriesByGradePoint = { x: string; y: number }
export type TriesByGradeSeries = {
  color: string
  data: TriesByGradePoint[]
  id: 'min' | 'average' | 'max'
}
type Datum = { average: number; grade: string; max: number; min: number }
const getCategory = (datum: Datum) => datum.grade

export function TriesByGrade({ ascents }: { ascents: Ascent[] }) {
  const source = getTriesByGrade(ascents)
  if (source.every(item => item.data.every(point => point.y === 1))) return
  const grades = source[0]?.data.map(point => point.x) ?? []
  const data = grades.map(
    (grade, index) =>
      Object.fromEntries([
        ['grade', grade],
        ...source.map(series => [series.id, series.data[index]?.y ?? 0]),
      ]) as Datum,
  )
  const series = source.map(item => ({
    key: item.id,
    label: item.id[0]?.toUpperCase() + item.id.slice(1),
    color: item.color,
  })) satisfies ChartSeries[]
  return (
    <ChartContainer caption='Tries by Grade'>
      <TanStackLineChart
        ariaLabel='Tries by Grade'
        data={data}
        getCategory={getCategory}
        series={series}
        x={{ label: 'Grades' }}
        y={{ label: '# Tries' }}
      />
    </ChartContainer>
  )
}
