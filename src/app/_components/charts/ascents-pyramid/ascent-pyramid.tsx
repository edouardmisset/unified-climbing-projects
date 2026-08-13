import { ChartContainer } from '../chart-container/chart-container'
import { TanStackBarChart, type ChartSeries } from '../tanstack-chart'
import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { getGradeFrequencyAndColors } from './get-grade-frequency'

type Datum = ReturnType<typeof getGradeFrequencyAndColors>[number]
const SERIES = ASCENT_STYLE.map(key => ({
  key,
  color: ASCENT_STYLE_TO_COLOR[key],
})) satisfies ChartSeries[]
const getCategory = (datum: Datum) => datum.grade

export function AscentPyramid({ ascents }: { ascents: Ascent[] }) {
  const data = getGradeFrequencyAndColors(ascents)
  if (data.length === 0) return
  return (
    <ChartContainer caption='Ascent Pyramid'>
      <TanStackBarChart
        ariaLabel='Ascent Pyramid'
        data={data}
        getCategory={getCategory}
        series={SERIES}
        y={{ label: '# Ascents' }}
      />
    </ChartContainer>
  )
}
