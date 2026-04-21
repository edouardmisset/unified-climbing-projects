import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, createHorizontalChart, ResponsiveContainer } from 'recharts'

import { ChartContainer } from '../chart-container/chart-container'
import { BAR_CATEGORY_GAP, formatYearTick, GRID_STROKE } from '../constants'
import { ChartXAxis, ChartYAxis, ChartTooltip } from '../chart-elements'

import { fromGradeToBackgroundColor } from '~/ascents/helpers/ascent-converter'
import { _GRADES, type Ascent } from '~/ascents/schema'
import { getAscentsPerYearByGrade } from './get-ascents-per-year-by-grade'

type AscentsPerYearByGradeDatum = ReturnType<typeof getAscentsPerYearByGrade>[number]

const Chart = createHorizontalChart<AscentsPerYearByGradeDatum>()({
  BarChart,
  Bar,
})

const AXIS_LABELS = {
  numberOfAscents: '# Ascents',
  years: 'Years',
}

export function AscentsPerYearByGrade({ ascents }: { ascents: Ascent[] }) {
  const ascentsPerYearByGrade = useMemo(() => getAscentsPerYearByGrade(ascents), [ascents])

  const uniqueYearsCount = new Set(ascentsPerYearByGrade.map(({ year }) => year)).size

  if (uniqueYearsCount <= 1 || ascentsPerYearByGrade.length === 0) return

  return (
    <ChartContainer caption='Ascents Per Year By Grade'>
      <ResponsiveContainer height='100%' width='100%'>
        <Chart.BarChart
          accessibilityLayer={false}
          barCategoryGap={BAR_CATEGORY_GAP}
          data={ascentsPerYearByGrade}
        >
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <ChartXAxis dataKey='year' labelText={AXIS_LABELS.years} tickFormatter={formatYearTick} />
          <ChartYAxis labelText={AXIS_LABELS.numberOfAscents} />
          <ChartTooltip />
          {_GRADES.map(key => (
            <Chart.Bar
              key={key}
              dataKey={key}
              fill={fromGradeToBackgroundColor(key)}
              stackId='grades'
            />
          ))}
        </Chart.BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
