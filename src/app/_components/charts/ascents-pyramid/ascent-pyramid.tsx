import { type ComputedDatum, ResponsiveBar } from '@nivo/bar'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import { useMemo } from 'react'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import {
  type GradeFrequency,
  getGradeFrequencyAndColors,
} from '../ascents-pyramid/get-grade-frequency'
import { ChartContainer } from '../chart-container/chart-container'
import {
  DEFAULT_CHART_MARGIN,
  defaultBarChartPadding,
  defaultMotionConfig,
  gradesBottomAxis,
  numberOfAscentsAxisLeft,
  theme,
} from '../constants'

const STYLE_COLORS = {
  Flash: 'var(--flash)',
  Onsight: 'var(--onsight)',
  Redpoint: 'var(--redpoint)',
} as const satisfies Record<Ascent['style'], string>

const colors: OrdinalColorScaleConfig<ComputedDatum<GradeFrequency[number]>> = ({ id }) =>
  id === 'Flash' || id === 'Onsight' || id === 'Redpoint' ? STYLE_COLORS[id] : ''

export function AscentPyramid({ ascents }: { ascents: Ascent[] }) {
  const gradeFrequency = useMemo(() => getGradeFrequencyAndColors(ascents), [ascents])

  if (gradeFrequency.length === 0) return null

  return (
    <ChartContainer caption='Ascent Pyramid'>
      <ResponsiveBar
        axisBottom={gradesBottomAxis}
        axisLeft={numberOfAscentsAxisLeft}
        colors={colors}
        data={gradeFrequency}
        enableGridY={false}
        enableLabel={false}
        enableTotals
        indexBy='grade'
        keys={ASCENT_STYLE}
        margin={DEFAULT_CHART_MARGIN}
        motionConfig={defaultMotionConfig}
        padding={defaultBarChartPadding}
        theme={theme}
      />
    </ChartContainer>
  )
}
