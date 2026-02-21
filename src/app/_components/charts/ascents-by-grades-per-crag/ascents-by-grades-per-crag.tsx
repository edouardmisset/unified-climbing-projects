import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import {
  AXIS_TICK_STYLE,
  BAR_CATEGORY_GAP,
  CURSOR_STYLE,
  GRID_STROKE,
  TOOLTIP_STYLE,
} from '../constants'

import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { _GRADES, type Ascent } from '~/schema/ascent'
import { getAscentsByGradesPerCrag } from './get-ascents-by-grades-per-crag'

export function AscentsByGradesPerCrag({ ascents }: { ascents: Ascent[] }) {
  const ascentsByGradesPerCrag = useMemo(
    () => getAscentsByGradesPerCrag(ascents).reverse(),
    [ascents],
  )

  if (ascentsByGradesPerCrag.length === 0) return

  const uniqueCragsCount = new Set(ascentsByGradesPerCrag.map(({ crag }) => crag)).size
  if (uniqueCragsCount <= 1) return

  return (
    <ChartContainer caption='Ascents By Grades Per Crag'>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart barCategoryGap={BAR_CATEGORY_GAP} data={ascentsByGradesPerCrag} layout='vertical'>
          <CartesianGrid stroke={GRID_STROKE} vertical horizontal={false} />
          <XAxis tick={AXIS_TICK_STYLE} type='number' />
          <YAxis reversed dataKey='crag' tick={AXIS_TICK_STYLE} type='category' width={200} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
          {_GRADES.map(key => (
            <Bar key={key} dataKey={key} fill={fromGradeToBackgroundColor(key)} stackId='grades' />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
