// oxlint-disable react/no-multi-comp
import { useMemo } from 'react'
import {
  Tooltip,
  XAxis,
  YAxis,
  type CartesianAxisProps,
  type XAxisProps as RechartsXAxisProps,
  type YAxisProps as RechartsYAxisProps,
  type LabelProps,
  type TooltipProps,
} from 'recharts'

import {
  AXIS_LABEL_STYLE,
  AXIS_TICK_STYLE,
  CURSOR_STYLE,
  DEFAULT_X_AXIS_OFFSET,
  TOOLTIP_STYLE,
} from './constants'

type XAxisProps<DataPointType, DataValueType> = {
  dataKey?: RechartsXAxisProps<DataPointType, DataValueType>['dataKey']
  labelText?: LabelProps['value']
  offset?: LabelProps['offset']
  position?: LabelProps['position']
  tickFormatter?: RechartsXAxisProps<DataPointType, DataValueType>['tickFormatter']
  type?: RechartsXAxisProps<DataPointType, DataValueType>['type']
  width?: CartesianAxisProps['width']
}

export function ChartXAxis<DataPointType = unknown, DataValueType = unknown>(
  props: XAxisProps<DataPointType, DataValueType>,
) {
  const {
    dataKey,
    labelText,
    offset = DEFAULT_X_AXIS_OFFSET,
    position = 'bottom',
    tickFormatter,
    type,
    width,
  } = props

  const label = useMemo<LabelProps | undefined>(() => {
    if (!labelText) return undefined
    return { ...AXIS_LABEL_STYLE, value: labelText, offset, position }
  }, [labelText, offset, position])

  return (
    <XAxis<DataPointType, DataValueType>
      dataKey={dataKey}
      label={label}
      tick={AXIS_TICK_STYLE}
      tickFormatter={tickFormatter}
      type={type}
      width={width}
    />
  )
}

type YAxisProps<DataPointType, DataValueType> = {
  dataKey?: RechartsYAxisProps<DataPointType, DataValueType>['dataKey']
  labelText?: LabelProps['value']
  domain?: RechartsYAxisProps<DataPointType, DataValueType>['domain']
  tickFormatter?: RechartsYAxisProps<DataPointType, DataValueType>['tickFormatter']
}

export function ChartYAxis<DataPointType = unknown, DataValueType = unknown>(
  props: YAxisProps<DataPointType, DataValueType>,
) {
  const { dataKey, labelText, domain, tickFormatter } = props

  const label = useMemo<LabelProps | undefined>(() => {
    if (!labelText) return undefined
    return { ...AXIS_LABEL_STYLE, value: labelText, angle: -90, position: 'insideLeft' }
  }, [labelText])

  return (
    <YAxis<DataPointType, DataValueType>
      dataKey={dataKey}
      label={label}
      domain={domain}
      tick={AXIS_TICK_STYLE}
      tickFormatter={tickFormatter}
    />
  )
}

type ChartTooltipProps = {
  formatter?: TooltipProps['formatter']
  showCursor?: boolean
  content?: TooltipProps['content']
}

export function ChartTooltip({ formatter, showCursor = true, content }: ChartTooltipProps) {
  return (
    <Tooltip
      content={content}
      contentStyle={TOOLTIP_STYLE}
      formatter={formatter}
      cursor={showCursor ? CURSOR_STYLE : undefined}
    />
  )
}
