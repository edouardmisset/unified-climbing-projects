'use client'

// oxlint-disable react/no-multi-comp

import {
  areaY,
  barX,
  barY,
  colorLegend,
  defineChart,
  group,
  lineY,
  stack,
  type ChartPoint,
  type ChartTooltipContentContext,
} from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'

type ChartValue = string | number | Date

const DEFAULT_CHART_HEIGHT = 440
const BAND_PADDING = 0.16
const POINT_PADDING = 0.15
const DONUT_INNER_RADIUS_RATIO = 0.5

export type ChartSeries = {
  color: string
  key: string
  label?: string
}

type AxisOptions = {
  label?: string
  tickFormat?: (value: ChartValue) => string
}

type WideChartProps<TDatum> = {
  ariaLabel: string
  data: readonly TDatum[]
  getCategory: (datum: TDatum) => ChartValue
  height?: number
  legend?: boolean
  series: readonly ChartSeries[]
  x?: AxisOptions
  y?: AxisOptions
}

type FlatDatum<TDatum> = {
  category: ChartValue
  series: string
  source: TDatum
  value: number
}

function flattenData<TDatum>(
  data: readonly TDatum[],
  getCategory: (datum: TDatum) => ChartValue,
  series: readonly ChartSeries[],
): FlatDatum<TDatum>[] {
  return data.flatMap(datum =>
    series.flatMap(config => {
      const value = (datum as Record<string, unknown>)[config.key]
      return typeof value === 'number'
        ? [
            {
              category: getCategory(datum),
              series: config.label ?? config.key,
              source: datum,
              value,
            },
          ]
        : []
    }),
  )
}

function colorOptions(series: readonly ChartSeries[], legend: boolean) {
  return {
    domain: series.map(config => config.label ?? config.key),
    range: series.map(config => config.color),
    legend: legend ? colorLegend() : undefined,
  }
}

export function TanStackBarChart<TDatum>(
  props: WideChartProps<TDatum> & {
    orientation?: 'horizontal' | 'vertical'
    mode?: 'group' | 'stack'
  },
) {
  const {
    ariaLabel,
    data,
    getCategory,
    height = DEFAULT_CHART_HEIGHT,
    legend = false,
    mode = 'stack',
    orientation = 'vertical',
    series,
    x,
    y,
  } = props

  const rows = flattenData(data, getCategory, series)
  const layout = mode === 'group' ? group() : stack()
  const colors = colorOptions(series, legend)
  let focus: false | 'group-x' | 'group-y' = false
  if (mode === 'stack') focus = orientation === 'horizontal' ? 'group-y' : 'group-x'
  const stackTooltip =
    mode === 'stack'
      ? {
          use: tooltip,
          anchor: 'group-center' as const,
          content: (
            points: readonly ChartPoint<FlatDatum<TDatum>, ChartValue, ChartValue>[],
            context: ChartTooltipContentContext,
          ) => {
            if (points.length === 0) return { rows: [] }
            const [first] = points
            if (!first) return { rows: [] }
            const formatCategory = orientation === 'horizontal' ? context.formatY : context.formatX
            const formatValue = orientation === 'horizontal' ? context.formatX : context.formatY
            const category = orientation === 'horizontal' ? first.yValue : first.xValue
            const getValue = (point: { xValue: ChartValue; yValue: ChartValue }) =>
              orientation === 'horizontal' ? point.xValue : point.yValue
            const total = points.reduce((sum, point) => {
              const value = getValue(point)
              return sum + (typeof value === 'number' ? value : 0)
            }, 0)
            return {
              title: formatCategory(category),
              rows: [
                ...points.map(point => {
                  const value = getValue(point)
                  return { color: point.color, label: point.groupLabel, value: formatValue(value) }
                }),
                { label: 'Total', value: formatValue(total) },
              ],
            }
          },
          sort: 'color-domain' as const,
        }
      : tooltip

  const definition =
    orientation === 'horizontal'
      ? defineChart({
          focus,
          marks: [
            barX(rows, {
              x: 'value',
              y: 'category',
              z: 'series',
              color: 'series',
              layout,
              inset: 2,
            }),
          ],
          x: {
            scale: scaleLinear,
            grid: true,
            axis: { label: x?.label, ticks: { format: x?.tickFormat } },
          },
          y: {
            scale: () => scaleBand<ChartValue>().padding(BAND_PADDING),
            axis: { label: y?.label, ticks: { format: y?.tickFormat } },
          },
          color: colors,
          tooltip: stackTooltip,
        })
      : defineChart({
          focus,
          marks: [
            barY(rows, {
              x: 'category',
              y: 'value',
              z: 'series',
              color: 'series',
              layout,
              inset: 2,
            }),
          ],
          x: {
            scale: () => scaleBand<ChartValue>().padding(BAND_PADDING),
            axis: { label: x?.label, ticks: { format: x?.tickFormat } },
          },
          y: {
            scale: scaleLinear,
            nice: true,
            grid: true,
            axis: { label: y?.label, ticks: { format: y?.tickFormat } },
          },
          color: colors,
          tooltip: stackTooltip,
        })

  return <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
}

export function TanStackLineChart<TDatum>(props: WideChartProps<TDatum>) {
  const {
    ariaLabel,
    data,
    getCategory,
    height = DEFAULT_CHART_HEIGHT,
    legend = true,
    series,
    x,
    y,
  } = props

  const rows = flattenData(data, getCategory, series)
  const definition = defineChart({
    marks: [
      lineY(rows, {
        x: 'category',
        y: 'value',
        z: 'series',
        color: 'series',
        points: true,
        strokeWidth: 2,
      }),
    ],
    x: {
      scale: () => scalePoint<ChartValue>().padding(POINT_PADDING),
      axis: { label: x?.label, ticks: { format: x?.tickFormat } },
    },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { label: y?.label, ticks: { format: y?.tickFormat } },
    },
    color: colorOptions(series, legend),
    tooltip,
  })

  return <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
}

export function TanStackAreaChart<TDatum>(props: WideChartProps<TDatum>) {
  const {
    ariaLabel,
    data,
    getCategory,
    height = DEFAULT_CHART_HEIGHT,
    legend = true,
    series,
    x,
    y,
  } = props

  const rows = flattenData(data, getCategory, series)
  const definition = defineChart({
    marks: [
      areaY(rows, {
        x: 'category',
        y: 'value',
        z: 'series',
        color: 'series',
        layout: stack({ offset: 'normalize' }),
        fillOpacity: 0.8,
      }),
    ],
    x: {
      scale: () => scalePoint<ChartValue>().padding(POINT_PADDING),
      axis: { label: x?.label, ticks: { format: x?.tickFormat } },
    },
    y: {
      scale: scaleLinear,
      grid: true,
      axis: { label: y?.label, ticks: { format: y?.tickFormat } },
    },
    color: colorOptions(series, legend),
    tooltip,
  })

  return <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
}

type DonutDatum = { color: string; label: string; value: number }

export function TanStackDonutChart({
  ariaLabel,
  data,
  height = DEFAULT_CHART_HEIGHT,
  legend = false,
}: {
  ariaLabel: string
  data: readonly DonutDatum[]
  height?: number
  legend?: boolean
}) {
  const slices = pie(data, { value: 'value' })
  const total = data.reduce((sum, datum) => sum + datum.value, 0)
  const definition = defineChart({
    marks: [
      polar({
        inset: 8,
        radiusRatio: 0.82,
        marks: [
          radialArc(slices, {
            innerRadius: ({ radius }) => radius * DONUT_INNER_RADIUS_RATIO,
            cornerRadius: 10,
            color: 'label',
            key: 'label',
            stroke: 'var(--surface-3)',
            strokeWidth: 1,
          }),
        ],
      }),
    ],
    color: {
      domain: data.map(item => item.label),
      range: data.map(item => item.color),
      legend: legend ? colorLegend() : undefined,
    },
    tooltip: {
      use: tooltip,
      content: points => {
        const [point] = points
        if (!point) return { rows: [] }
        const datum = point.datum as DonutDatum
        const percentage = total === 0 ? 0 : datum.value / total
        return {
          title: datum.label,
          rows: [
            {
              label: 'Share',
              value: new Intl.NumberFormat(undefined, {
                style: 'percent',
                maximumFractionDigits: 1,
              }).format(percentage),
            },
            { label: 'Value', value: datum.value.toLocaleString() },
          ],
        }
      },
    },
  })

  return <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
}
