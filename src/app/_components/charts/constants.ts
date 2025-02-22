import type { AxisProps } from '@nivo/axes'
import type { OrdinalColorScaleConfig } from '@nivo/colors'
import type { Theme } from '@nivo/core'
import type { ComputedDatum } from '@nivo/pie'
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
}

export const DEFAULT_CHART_MARGIN = { bottom: 40, left: 50, top: 20, right: 20 }
export const DEFAULT_PIE_MARGIN = {
  top: 20,
  right: 100,
  bottom: 20,
  left: 100,
}

// biome-ignore lint/suspicious/noExplicitAny: This comes from the Nivo library
export const axisBottom: AxisProps<any> = {
  format: year => `'${year.toString().slice(2)}`,
}

export const chartColorGetter: OrdinalColorScaleConfig<
  ComputedDatum<{
    [grade: string]: number
    year: number
  }>
> = ({ id: grade, data }) => String(data[`${grade}Color`])

export const pieColorsGetter: OrdinalColorScaleConfig<
  Omit<ComputedDatum<ClimbingDisciplineMetric>, 'fill' | 'color' | 'arc'>
> = ({ data }) => data.color
