import { average } from '@edouardmisset/math/average.ts'
import { objectKeys } from '@edouardmisset/object/object-keys.ts'
import { capitalize } from '@edouardmisset/text/capitalize.ts'
import type { OrdinalColorScaleConfigCustomFunction } from '@nivo/colors'
import { type PointTooltipProps, ResponsiveLine } from '@nivo/line'
import { useMemo } from 'react'
import type { Ascent, Grade } from '~/schema/ascent'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  gradesBottomAxis,
  lineXScale,
  lineYScale,
  numberOfTriesAxisLeft,
  theme,
} from '../constants'
import styles from './tries-by-grades.module.css'

type LineChartDataStructure = {
  id: string | number // Min, average, max
  data: {
    x: string // The grade (sorted from easiest to hardest)
    y: number // The number of tries
  }[]
  color: string // The color of the line
}

const colors: OrdinalColorScaleConfigCustomFunction<LineChartDataStructure> = ({
  color,
}) => color

export function TriesByGrade({
  ascents,
  className,
}: { ascents: Ascent[]; className?: string }) {
  // group ascents by grade
  const ascentsTriesByGrades = useMemo(
    () =>
      ascents.reduce(
        (acc: Record<Grade, number[]>, { topoGrade, tries }) => {
          if (!acc[topoGrade]) {
            acc[topoGrade] = []
          }
          acc[topoGrade].push(tries)
          return acc
        },
        {} as Record<Grade, number[]>,
      ),
    [ascents],
  )

  const sortedGrades: Grade[] = useMemo(
    () => objectKeys(ascentsTriesByGrades).sort((a, b) => a.localeCompare(b)),
    [ascentsTriesByGrades],
  )

  const data: LineChartDataStructure[] = useMemo(
    () => [
      {
        id: 'min',
        data: sortedGrades.map(grade => ({
          x: grade,
          y: Math.min(...ascentsTriesByGrades[grade]),
        })),
        color: 'var(--min-tries)',
      },
      {
        id: 'average',
        data: sortedGrades.map(grade => ({
          x: grade,
          y: Math.round(average(...ascentsTriesByGrades[grade])),
        })),
        color: 'var(--average-tries)',
      },
      {
        id: 'max',
        data: sortedGrades.map(grade => ({
          x: grade,
          y: Math.max(...ascentsTriesByGrades[grade]),
        })),
        color: 'var(--max-tries)',
      },
    ],
    [sortedGrades, ascentsTriesByGrades],
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
