import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { OrdinalColorScaleConfigCustomFunction } from '@nivo/colors'
import {
  type ComputedSerie,
  type PointTooltipProps,
  ResponsiveLine,
  type Serie,
} from '@nivo/line'
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
import { getTriesByGrade } from './get-tries-by-grade'
import styles from './tries-by-grades.module.css'
/**
 * {
 *   id: string | number // Min, average, max
 *   data: {
 *     x: string // The grade (sorted from easiest to hardest)
 *     y: number // The number of tries
 *   }[]
 * }
 */
export type LineChartDataStructure = Serie &
  Required<Pick<ComputedSerie, 'color'>>

const colors: OrdinalColorScaleConfigCustomFunction<LineChartDataStructure> = ({
  color,
}) => color

const legends = [
  {
    anchor: 'top',
    direction: 'column',
    itemBackground: 'var(--surface-1)',
    itemWidth: 80,
    itemHeight: 20,
    symbolShape: 'circle',
  },
] as const

export function TriesByGrade({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  const data: LineChartDataStructure[] = useMemo(
    () => getTriesByGrade(ascents),
    [ascents],
  )

  return (
    <ChartContainer caption="Tries by Grade" className={className}>
      <ResponsiveLine
        data={data}
        margin={DEFAULT_CHART_MARGIN}
        curve="natural"
        enableGridX={false}
        xScale={lineXScale}
        yScale={lineYScale}
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfTriesAxisLeft}
        legends={legends}
        pointSize={8}
        colors={colors}
        theme={theme}
        enableTouchCrosshair={true}
        useMesh={true}
        tooltip={Tooltip}
      />
    </ChartContainer>
  )
}

const Tooltip = ({ point }: PointTooltipProps) => (
  <div className={styles.tooltip}>
    <strong>{point.data.xFormatted}</strong>{' '}
    {capitalize(point.serieId.toString())} # of tries:{' '}
    <strong>{point.data.yFormatted}</strong>
  </div>
)
