import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  TOOLTIP_STYLE,
} from '../constants'

import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { _GRADES, type Ascent } from '~/schema/ascent'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

const AXIS_LABELS = {
  numberOfAscents: 'Number of Ascents',
}

export function AscentsByGradesPerCrag({ ascents }: { ascents: Ascent[] }) {
  const ascentsByGradesPerCrag = useMemo(
    () => getAscentsByGradesPerCrag(ascents).reverse(),
    [ascents],
  )

  if (ascentsByGradesPerCrag.length === 0) return null

  const uniqueCragsCount = new Set(ascentsByGradesPerCrag.map(({ crag }) => crag)).size
  if (uniqueCragsCount <= 1) return null

  return (
    <ChartContainer caption='Ascents By Grades Per Crag'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={ascentsByGradesPerCrag} layout='vertical'>
          <XAxis
            label={{
              value: AXIS_LABELS.numberOfAscents,
              offset: 20,
              position: 'bottom',
              ...AXIS_LABEL_STYLE,
            }}
            tick={AXIS_TICK_STYLE}
            type='number'
          />
          <YAxis dataKey='crag' tick={AXIS_TICK_STYLE} type='category' width={150} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          {_GRADES.map(key => (
            <Bar key={key} dataKey={key} fill={fromGradeToBackgroundColor(key)} stackId='grades' />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
