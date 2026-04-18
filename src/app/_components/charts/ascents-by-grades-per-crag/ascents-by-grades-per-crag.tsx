import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, createVerticalChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

type AscentsByGradesPerCragDatum = ReturnType<typeof getAscentsByGradesPerCrag>[number]

const Chart = createVerticalChart<AscentsByGradesPerCragDatum>()({
  BarChart,
  Bar,
  XAxis,
  YAxis,
})

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
        <Chart.BarChart
          accessibilityLayer={false}
          barCategoryGap={BAR_CATEGORY_GAP}
          data={ascentsByGradesPerCrag}
        >
          <CartesianGrid stroke={GRID_STROKE} vertical horizontal={false} />
          <Chart.XAxis tick={AXIS_TICK_STYLE} type='number' />
          <Chart.YAxis reversed dataKey='crag' tick={AXIS_TICK_STYLE} type='category' width={200} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} trigger='click' />
          {_GRADES.map(key => (
            <Chart.Bar key={key} dataKey={key} fill={fromGradeToBackgroundColor(key)} stackId='grades' />
          ))}
        </Chart.BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
