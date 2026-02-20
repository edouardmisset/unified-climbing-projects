import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'

import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { getGradeFrequencyAndColors } from '../ascents-pyramid/get-grade-frequency'
import { ASCENT_STYLE_TO_COLOR } from '~/constants/ascents'

const AXIS_LABELS = {
  grades: 'Grades',
  numberOfAscents: '# Ascents',
}

export function AscentPyramid({ ascents }: { ascents: Ascent[] }) {
  const gradeFrequency = useMemo(() => getGradeFrequencyAndColors(ascents), [ascents])

  if (gradeFrequency.length === 0) return null

  return (
    <ChartContainer caption='Ascent Pyramid'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={gradeFrequency}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis dataKey='grade' tick={AXIS_TICK_STYLE} />
          <YAxis
            label={{
              value: AXIS_LABELS.numberOfAscents,
              angle: -90,
              position: 'insideLeft',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          {ASCENT_STYLE.map(style => (
            <Bar key={style} dataKey={style} fill={ASCENT_STYLE_TO_COLOR[style]} stackId='styles' />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
