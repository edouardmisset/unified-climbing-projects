import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, createHorizontalChart, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { BAR_CATEGORY_GAP, GRID_STROKE } from '../constants'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'

import { ASCENT_STYLE, type Ascent } from '~/ascents/schema'
import { getGradeFrequencyAndColors } from '../ascents-pyramid/get-grade-frequency'
import { ASCENT_STYLE_TO_COLOR } from '~/ascents/constants'

type GradeFrequencyDatum = ReturnType<typeof getGradeFrequencyAndColors>[number]

const Chart = createHorizontalChart<GradeFrequencyDatum>()({
  BarChart,
  Bar,
})

const AXIS_LABELS = {
  grades: 'Grades',
  numberOfAscents: '# Ascents',
}

export function AscentPyramid({ ascents }: { ascents: Ascent[] }) {
  const gradeFrequency = useMemo(() => getGradeFrequencyAndColors(ascents), [ascents])

  if (gradeFrequency.length === 0) return

  return (
    <ChartContainer caption='Ascent Pyramid'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.BarChart
          accessibilityLayer={false}
          barCategoryGap={BAR_CATEGORY_GAP}
          data={gradeFrequency}
        >
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='grade' />
          <ChartYAxis labelText={AXIS_LABELS.numberOfAscents} />
          <ChartTooltip />
          {ASCENT_STYLE.map(style => (
            <Chart.Bar
              key={style}
              dataKey={style}
              fill={ASCENT_STYLE_TO_COLOR[style]}
              stackId='styles'
            />
          ))}
        </Chart.BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
