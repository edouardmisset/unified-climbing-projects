import type { AxisProps } from '@nivo/axes'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import type { Theme } from '@nivo/core'
import type { ComputedDatum } from '@nivo/pie'
import type { ScaleSpec } from '@nivo/scales'
import type { ClimbingDisciplineMetric } from './types'

export const theme: Theme = {
  background: 'var(--surface-1)',
  text: {
    fill: 'var(--text-1)',
  },
  tooltip: {
    container: {
      background: 'var(--surface-2)',
    },
  },
  axis: {
    ticks: {
      text: {
        fill: 'var(--text-2)',
        fontFamily: 'monospace',
        fontStyle: 'normal',
        fontSize: 'var(--font-size-1)',
      },
    },
  },
  labels: {
    text: {
      fontWeight: 'var(--font-weight-6)',
    },
  },
}

// Margins

export const DEFAULT_CHART_MARGIN = { bottom: 50, left: 60, top: 20, right: 20 }
export const DEFAULT_PIE_MARGIN = {
  top: 20,
  right: 100,
  bottom: 20,
  left: 100,
}

// Padding

export const defaultBarChartPadding = 0.3

// Motion

export const defaultMotionConfig = 'slow'

// Colors

export const chartColorGetter: OrdinalColorScaleConfig<
  ComputedDatum<{
    [grade: string]: number
    year: number
  }>
> = ({ id: grade, data }) => String(data[`${grade}Color`])

export const pieColorsGetter: OrdinalColorScaleConfig<
  Omit<ComputedDatum<ClimbingDisciplineMetric>, 'fill' | 'color' | 'arc'>
> = ({ data }) => data.color

// Scales

export const lineXScale: ScaleSpec = { type: 'point' }
export const lineYScale: ScaleSpec = {
  type: 'linear',
  min: 0,
  max: 'auto',
}

// Axis

export const numberOfTriesAxisLeft: AxisProps = {
  legend: '# Tries',
  legendOffset: -40,
  legendPosition: 'middle',
}
export const numberOfAscentsAxisLeft: AxisProps = {
  legend: '# Ascents',
  legendOffset: -50,
  legendPosition: 'middle',
}
export const heightAxisLeft: AxisProps = {
  legend: 'Height',
  legendOffset: -65,
  legendPosition: 'middle',
}

export const yearBottomAxis: AxisProps = {
  format: year => `'${year.toString().slice(2)}`,
  legend: 'Years',
  legendOffset: 40,
  legendPosition: 'middle',
}

export const gradesBottomAxis: AxisProps = {
  legend: 'Grades',
  legendOffset: 40,
  legendPosition: 'middle',
}

export const numberOfAscentsAxisBottom: AxisProps = {
  legend: 'Number of Ascents',
  legendPosition: 'middle',
  legendOffset: 40,
}
