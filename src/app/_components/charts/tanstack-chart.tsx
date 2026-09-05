'use client'

// oxlint-disable react/no-multi-comp

import {
  areaY,
  barX,
  barY,
  defineChart,
  group,
  lineY,
  stack,
  text,
  type ChartAnimationOptions,
  type ChartPoint,
  type ChartCurve,
  type ChartColorLegend,
  type ChartTooltipContent,
  type ChartTooltipContentContext,
  type SceneNode,
} from '@tanstack/charts'
import { pie, polar, radialArc, radialText } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/react'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import styles from './tanstack-chart.module.css'

type ChartValue = string | number | Date

const DEFAULT_CHART_HEIGHT = 440
const BAND_PADDING = 0.16
const POINT_PADDING = 0.15
const DONUT_INNER_RADIUS_RATIO = 0.5
const MIN_DONUT_LABEL_FRACTION = 0.06
const CURVE_TENSION_DENOMINATOR = 6
const LEGEND_DOT_RADIUS = 6
const LEGEND_FONT_SIZE = 13
const LEGEND_ROW_HEIGHT = 26
const LEGEND_ITEM_GAP = 24
const LEGEND_DOT_LABEL_GAP = 9
const LEGEND_MIN_ITEM_WIDTH = 96
const LEGEND_CHARACTER_WIDTH = 7
const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 1,
})

type LegendItem = { color: string; key: string; label: string; width: number }

function layoutLegendRows(items: readonly LegendItem[], width: number): LegendItem[][] {
  const rows: LegendItem[][] = []
  let row: LegendItem[] = []
  let rowWidth = 0
  for (const item of items) {
    const nextWidth = rowWidth + (row.length === 0 ? 0 : LEGEND_ITEM_GAP) + item.width
    if (row.length > 0 && nextWidth > width) {
      rows.push(row)
      row = [item]
      rowWidth = item.width
    } else {
      row.push(item)
      rowWidth = nextWidth
    }
  }
  if (row.length > 0) rows.push(row)
  return rows
}

function legendItems(colors: Parameters<ChartColorLegend['render']>[0]['colors']): LegendItem[] {
  return colors.domain.map(value => {
    const label = String(value)
    return {
      // oxlint-disable-next-line unicorn/no-array-callback-reference -- This is a color-scale lookup, not Array.map.
      color: colors.map(value),
      key: label,
      label,
      width: Math.max(
        LEGEND_MIN_ITEM_WIDTH,
        LEGEND_DOT_RADIUS * 2 + LEGEND_DOT_LABEL_GAP + label.length * LEGEND_CHARACTER_WIDTH,
      ),
    }
  })
}

const STANDARD_LEGEND: ChartColorLegend = {
  placement: 'bottom',
  height: (_itemCount, context) =>
    Math.max(1, layoutLegendRows(legendItems(context.colors), context.bounds.width).length) *
    LEGEND_ROW_HEIGHT,
  render: context => {
    const rows = layoutLegendRows(legendItems(context.colors), context.bounds.width)
    const children: SceneNode[] = []
    rows.forEach((row, rowIndex) => {
      const rowWidth =
        row.reduce((sum, item) => sum + item.width, 0) +
        Math.max(0, row.length - 1) * LEGEND_ITEM_GAP
      let x = context.bounds.x + (context.bounds.width - rowWidth) / 2
      const y = context.bounds.y + LEGEND_ROW_HEIGHT * rowIndex + LEGEND_ROW_HEIGHT / 2
      children.push({
        kind: 'rect',
        key: `legend-row-bounds:${rowIndex}`,
        x,
        y: y - LEGEND_ROW_HEIGHT / 2,
        width: rowWidth,
        height: LEGEND_ROW_HEIGHT,
        style: { fill: 'transparent' },
      })
      row.forEach(item => {
        children.push(
          {
            kind: 'dot',
            key: `legend-dot:${item.key}`,
            x: x + LEGEND_DOT_RADIUS,
            y,
            radius: LEGEND_DOT_RADIUS,
            style: { fill: item.color },
          },
          {
            kind: 'label',
            key: `legend-label:${item.key}`,
            x: x + LEGEND_DOT_RADIUS * 2 + LEGEND_DOT_LABEL_GAP,
            y,
            text: item.label,
            baseline: 'middle',
            fontSize: LEGEND_FONT_SIZE,
            style: { fill: context.theme.foreground },
          },
        )
        x += item.width + LEGEND_ITEM_GAP
      })
    })
    return {
      kind: 'group',
      key: 'legend',
      className: 'ts-chart__legend',
      ariaHidden: true,
      children,
    }
  },
}

function smoothLine(points: readonly (readonly [number, number])[]): string {
  const [first] = points
  if (!first) return ''
  if (points.length === 1) return `M${first[0]},${first[1]}`

  let path = `M${first[0]},${first[1]}`
  for (let index = 0; index < points.length - 1; index++) {
    const current = points[index] ?? first
    const next = points[index + 1] ?? current
    const previous = points[index - 1] ?? current
    const afterNext = points[index + 2] ?? next
    const control1X = current[0] + (next[0] - previous[0]) / CURVE_TENSION_DENOMINATOR
    const control1Y = current[1] + (next[1] - previous[1]) / CURVE_TENSION_DENOMINATOR
    const control2X = next[0] - (afterNext[0] - current[0]) / CURVE_TENSION_DENOMINATOR
    const control2Y = next[1] - (afterNext[1] - current[1]) / CURVE_TENSION_DENOMINATOR
    path += `C${control1X},${control1Y},${control2X},${control2Y},${next[0]},${next[1]}`
  }
  return path
}

const SMOOTH_CURVE: ChartCurve = {
  line: smoothLine,
  area: (top, bottom) => `${smoothLine(top)}${smoothLine(bottom.toReversed())}Z`,
}

export type ChartSeries = {
  color: string
  key: string
  label?: string
}

type AxisOptions = {
  domain?: readonly [number, number]
  label?: string
  tickFormat?: (value: ChartValue) => string
}

type WideChartProps<TDatum> = {
  ariaLabel: string
  animation?: boolean | ChartAnimationOptions
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
  label?: string
  series: string
  source: TDatum
  value: number
}

function createStackLabels<TDatum>(rows: readonly FlatDatum<TDatum>[]): FlatDatum<TDatum>[] {
  const totals = new Map<ChartValue, number>()
  for (const row of rows) totals.set(row.category, (totals.get(row.category) ?? 0) + row.value)

  const offsets = new Map<ChartValue, number>()
  return rows.map(row => {
    const total = totals.get(row.category) ?? 0
    const offset = offsets.get(row.category) ?? 0
    offsets.set(row.category, offset + row.value)
    return {
      ...row,
      label: percentFormatter.format(total === 0 ? 0 : row.value / total),
      value: offset + row.value / 2,
    }
  })
}

function createTotalLabels<TDatum>(rows: readonly FlatDatum<TDatum>[]): FlatDatum<TDatum>[] {
  const totals = new Map<ChartValue, number>()
  for (const row of rows) totals.set(row.category, (totals.get(row.category) ?? 0) + row.value)

  return [...totals.entries()].map(([category, value]) => ({
    category,
    label: String(value),
    series: 'total',
    source: undefined as TDatum,
    value,
  }))
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
    legend: legend ? STANDARD_LEGEND : undefined,
  }
}

function formatChartValue(value: ChartValue): string {
  if (value instanceof Date) return value.toLocaleDateString()
  return String(value)
}

function seriesTooltip<TDatum>(
  points: readonly ChartPoint<FlatDatum<TDatum>, ChartValue, ChartValue>[],
  context: ChartTooltipContentContext,
  options: { reverse?: boolean; orientation?: 'horizontal' | 'vertical' } = {},
): ChartTooltipContent {
  const [first] = points
  if (!first) return { rows: [] }
  const horizontal = options.orientation === 'horizontal'
  const orderedPoints = options.reverse === true ? points.toReversed() : points
  return {
    title: formatChartValue(horizontal ? first.yValue : first.xValue),
    rows: orderedPoints.map(point => {
      const value = horizontal ? point.xValue : point.yValue
      return {
        color: point.color,
        label: point.groupLabel,
        value: horizontal ? context.formatX(value) : context.formatY(value),
      }
    }),
  }
}

type BarDefinitionOptions<TDatum> = {
  animation?: boolean | ChartAnimationOptions
  colors: ReturnType<typeof colorOptions>
  focus: 'group-x' | 'group-y'
  layout: ReturnType<typeof group> | ReturnType<typeof stack>
  mode: 'group' | 'stack'
  orientation: 'horizontal' | 'vertical'
  rows: FlatDatum<TDatum>[]
  stackLabels: FlatDatum<TDatum>[]
  totalLabels: FlatDatum<TDatum>[]
  x: AxisOptions | undefined
  y: AxisOptions | undefined
}

function stackTooltipContent<TDatum>(
  points: readonly ChartPoint<FlatDatum<TDatum>, ChartValue, ChartValue>[],
  context: ChartTooltipContentContext,
  orientation: 'horizontal' | 'vertical',
): ChartTooltipContent {
  const seriesPoints = points.filter(point => point.datum.label === undefined)
  const [first] = seriesPoints
  if (!first) return { rows: [] }

  const horizontal = orientation === 'horizontal'
  const formatValue = horizontal ? context.formatX : context.formatY
  const category = horizontal ? first.yValue : first.xValue
  const values = seriesPoints.map(point => {
    const value = horizontal ? point.xValue : point.yValue
    return {
      point,
      rawValue: typeof value === 'number' ? value : 0,
      value,
    }
  })
  const total = values.reduce((sum, entry) => sum + entry.rawValue, 0)

  return {
    title: formatChartValue(category),
    rows: values.toReversed().map(({ point, rawValue, value }) => {
      const percentage = total === 0 ? 0 : rawValue / total
      return {
        color: point.color,
        label: point.groupLabel,
        value: `${percentFormatter.format(percentage)} (${formatValue(value)})`,
      }
    }),
  }
}

type BarTooltip<TDatum> = {
  use: typeof tooltip
  anchor: 'group-center'
  content: (
    points: readonly ChartPoint<FlatDatum<TDatum>, ChartValue, ChartValue>[],
    context: ChartTooltipContentContext,
  ) => ChartTooltipContent
  sort?: 'color-domain'
}

function createBarTooltip<TDatum>(
  mode: 'group' | 'stack',
  orientation: 'horizontal' | 'vertical',
): BarTooltip<TDatum> {
  if (mode === 'stack')
    return {
      use: tooltip,
      anchor: 'group-center',
      content: (points, context) => stackTooltipContent(points, context, orientation),
      sort: 'color-domain',
    }

  return {
    use: tooltip,
    anchor: 'group-center',
    content: (points, context) => seriesTooltip(points, context, { reverse: true, orientation }),
  }
}

function animationOptions(animation?: boolean | ChartAnimationOptions) {
  if (animation === undefined) return {}
  return { svgAnimation: animation }
}

function horizontalBarAxes(x: AxisOptions | undefined, y: AxisOptions | undefined) {
  return {
    x: {
      scale: x?.domain ? scaleLinear().domain(x.domain) : scaleLinear,
      grid: true,
      axis: { label: x?.label, ticks: { format: x?.tickFormat } },
    },
    y: {
      scale: () => scaleBand<ChartValue>().padding(BAND_PADDING),
      axis: { label: y?.label, ticks: { format: y?.tickFormat } },
    },
  }
}

function verticalBarAxes(x: AxisOptions | undefined, y: AxisOptions | undefined) {
  return {
    x: {
      scale: () => scaleBand<ChartValue>().padding(BAND_PADDING),
      axis: { label: x?.label, ticks: { format: x?.tickFormat } },
    },
    y: {
      scale: y?.domain ? scaleLinear().domain(y.domain) : scaleLinear,
      nice: y?.domain === undefined,
      grid: true,
      axis: { label: y?.label, ticks: { format: y?.tickFormat } },
    },
  }
}

function createBarDefinition<TDatum>(options: BarDefinitionOptions<TDatum>) {
  const barTooltip = createBarTooltip(options.mode, options.orientation)
  const horizontal = options.orientation === 'horizontal'
  const labelPosition = horizontal
    ? { x: 'value' as const, y: 'category' as const }
    : { x: 'category' as const, y: 'value' as const }
  const barOptions = {
    id: 'bars',
    key: (datum: FlatDatum<TDatum>) => String(datum.category),
    z: 'series' as const,
    color: 'series' as const,
    layout: options.layout,
    inset: 2,
  }
  const bars = horizontal
    ? barX(options.rows, { ...barOptions, x: 'value' as const, y: 'category' as const })
    : barY(options.rows, { ...barOptions, x: 'category' as const, y: 'value' as const })
  const stackLabel =
    options.stackLabels.length === 0
      ? []
      : [
          text(options.stackLabels, {
            ...labelPosition,
            text: 'label',
            fill: 'white',
            fontSize: 12,
            fontWeight: 700,
          }),
        ]
  const totalLabel = text(options.totalLabels, {
    ...labelPosition,
    text: 'label',
    fill: 'var(--text-1)',
    fontSize: 12,
    fontWeight: 700,
    ...(horizontal ? { anchor: 'start' as const, dx: 6 } : { anchor: 'middle' as const, dy: -8 }),
  })

  return defineChart({
    focus: options.focus,
    marks: [bars, ...stackLabel, totalLabel],
    ...(horizontal
      ? horizontalBarAxes(options.x, options.y)
      : verticalBarAxes(options.x, options.y)),
    color: options.colors,
    tooltip: barTooltip,
    ...animationOptions(options.animation),
  })
}

export function TanStackBarChart<TDatum>(
  props: WideChartProps<TDatum> & {
    orientation?: 'horizontal' | 'vertical'
    mode?: 'group' | 'stack'
    percentageLabels?: boolean
    totalLabels?: boolean
  },
) {
  const {
    ariaLabel,
    animation,
    data,
    getCategory,
    height = DEFAULT_CHART_HEIGHT,
    legend = false,
    mode = 'stack',
    orientation = 'vertical',
    percentageLabels = false,
    series,
    totalLabels: showTotalLabels = false,
    x,
    y,
  } = props

  const rows = flattenData(data, getCategory, series)
  const stackLabels = percentageLabels ? createStackLabels(rows) : []
  const totalLabels = showTotalLabels ? createTotalLabels(rows) : []
  const layout = mode === 'group' ? group() : stack()
  const colors = colorOptions(series, legend)
  const focus = orientation === 'horizontal' ? 'group-y' : 'group-x'
  const definition = createBarDefinition({
    animation,
    colors,
    focus,
    layout,
    mode,
    orientation,
    rows,
    stackLabels,
    totalLabels,
    x,
    y,
  })

  return (
    <div className={styles.chartSurface}>
      <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
    </div>
  )
}

type SeriesChartKind = 'area' | 'line'

function TanStackSeriesChart<TDatum>({
  kind,
  ...props
}: WideChartProps<TDatum> & { kind: SeriesChartKind }) {
  const {
    ariaLabel,
    animation,
    data,
    getCategory,
    height = DEFAULT_CHART_HEIGHT,
    legend = true,
    series,
    x,
    y,
  } = props
  const rows = flattenData(data, getCategory, series)
  const mark =
    kind === 'line'
      ? lineY(rows, {
          id: 'line',
          key: datum => String(datum.category),
          x: 'category',
          y: 'value',
          z: 'series',
          color: 'series',
          points: true,
          strokeWidth: 2,
          curve: SMOOTH_CURVE,
        })
      : areaY(rows, {
          id: 'area',
          key: datum => String(datum.category),
          x: 'category',
          y: 'value',
          z: 'series',
          color: 'series',
          layout: stack({ offset: 'normalize' }),
          fillOpacity: 0.8,
        })
  const definition = defineChart({
    focus: 'group-x',
    marks: [mark],
    x: {
      scale: () => scalePoint<ChartValue>().padding(POINT_PADDING),
      axis: { label: x?.label, ticks: { format: x?.tickFormat } },
    },
    y: {
      scale: scaleLinear,
      ...(kind === 'line' ? { nice: true } : {}),
      grid: true,
      axis: { label: y?.label, ticks: { format: y?.tickFormat } },
    },
    color: colorOptions(series, legend),
    tooltip: {
      use: tooltip,
      anchor: 'group-center',
      content: seriesTooltip,
    },
    ...animationOptions(animation),
  })

  return (
    <div className={styles.chartSurface}>
      <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
    </div>
  )
}

export function TanStackLineChart<TDatum>(props: WideChartProps<TDatum>) {
  return <TanStackSeriesChart {...props} kind='line' />
}

export function TanStackAreaChart<TDatum>(props: WideChartProps<TDatum>) {
  return <TanStackSeriesChart {...props} kind='area' />
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
          radialText(slices, {
            angle: 'angle',
            radius: 0.68,
            text: slice =>
              slice.fraction >= MIN_DONUT_LABEL_FRACTION
                ? new Intl.NumberFormat(undefined, {
                    style: 'percent',
                    maximumFractionDigits: 0,
                  }).format(slice.fraction)
                : undefined,
            fill: 'white',
            fontSize: 12,
            fontWeight: 700,
            key: 'label',
          }),
        ],
        angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
        radius: { scale: scaleLinear().domain([0, 1]) },
      }),
    ],
    color: {
      domain: data.map(item => item.label),
      range: data.map(item => item.color),
      legend: legend ? STANDARD_LEGEND : undefined,
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
              color: datum.color,
              label: datum.label,
              value: `${new Intl.NumberFormat(undefined, {
                style: 'percent',
                maximumFractionDigits: 1,
              }).format(percentage)} (${datum.value.toLocaleString()})`,
            },
          ],
        }
      },
    },
  })

  return (
    <div className={styles.chartSurface}>
      <Chart definition={definition} height={height} ariaLabel={ariaLabel} />
    </div>
  )
}
