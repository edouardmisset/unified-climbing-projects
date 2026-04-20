import type { PieLabelRenderProps } from 'recharts'
import { PIE_LABEL_TEXT_COLOR } from './constants'

export function renderPieArcLabel(params: { props: PieLabelRenderProps; total: number }) {
  const { props, total } = params
  const { value } = props

  if (!Number.isFinite(value) || value <= 0 || total <= 0) return

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
