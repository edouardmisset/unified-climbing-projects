import type { PieLabelRenderProps } from 'recharts'
import { PIE_LABEL_TEXT_COLOR } from './constants'

export function renderPieArcLabel(params: {
  props: PieLabelRenderProps
  total: number
}): React.JSX.Element | null {
  const { props, total } = params
  const value = Number(props.value)

  if (!Number.isFinite(value) || value <= 0 || total <= 0) return null

  const percentage = Math.round((value / total) * 100)

  return (
    <text
      x={props.x}
      y={props.y}
      fill={PIE_LABEL_TEXT_COLOR}
      textAnchor='middle'
      dominantBaseline='central'
    >
      {`${value} (${percentage}%)`}
    </text>
  )
}
