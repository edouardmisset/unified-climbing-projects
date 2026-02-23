import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { BAR_CATEGORY_GAP, GRID_STROKE } from '../constants'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'

import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { getGradeFrequencyAndColors } from '../ascents-pyramid/get-grade-frequency'
import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'

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
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={gradeFrequency}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='grade' />
          <ChartYAxis labelText={AXIS_LABELS.numberOfAscents} />
          <ChartTooltip />
          {ASCENT_STYLE.map(style => (
            <Bar key={style} dataKey={style} fill={ASCENT_STYLE_TO_COLOR[style]} stackId='styles' />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
