import type { OrdinalColorScaleConfigCustomFunction } from '@nivo/colors'
import { type ComputedSerie, ResponsiveLine, type Serie } from '@nivo/line'
import { useMemo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  gradesBottomAxis,
  lineXScale,
  lineYScale,
  numberOfTriesAxisLeft,
  theme,
} from '../constants'
import { TriesByGradeTooltip } from './tries-by-grade-tooltip'
import { getTriesByGrade } from './get-tries-by-grade'
/**
 * {
 *   id: string | number // Min, average, max
 *   data: {
 *     x: string // The grade (sorted from easiest to hardest)
 *     y: number // The number of tries
 *   }[]
 * }
 */
export type LineChartDataStructure = Serie & Required<Pick<ComputedSerie, 'color'>>

const colors: OrdinalColorScaleConfigCustomFunction<LineChartDataStructure> = ({ color }) => color

const legends = [
  {
    anchor: 'top',
    direction: 'column',
    itemBackground: 'var(--surface-1)',
    itemHeight: 20,
    itemWidth: 80,
    symbolShape: 'circle',
  },
] as const

export function TriesByGrade({ ascents }: { ascents: Ascent[] }) {
  const data: LineChartDataStructure[] = useMemo(() => getTriesByGrade(ascents), [ascents])

  const isFirstTry = data.every(item => item.data.every(point => point.y === 1))

  if (data.length === 0 || isFirstTry) return null

  return (
    <ChartContainer caption='Tries by Grade'>
      <ResponsiveLine
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfTriesAxisLeft}
        colors={colors}
        curve='natural'
        data={data}
        enableGridX={false}
        enableTouchCrosshair
        legends={legends}
        margin={DEFAULT_CHART_MARGIN}
        pointSize={8}
        theme={theme}
        tooltip={TriesByGradeTooltip}
        useMesh
        xScale={lineXScale}
        yScale={lineYScale}
      />
    </ChartContainer>
  )
}
