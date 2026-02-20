import type { PieProps } from 'recharts'

export const AXIS_TICK_STYLE = {
  fill: 'var(--text-2)',
  fontFamily: 'monospace',
  fontSize: 'var(--font-size-1)',
} as const

export const AXIS_LABEL_STYLE = {
  fill: 'var(--text-1)',
} as const

export const TOOLTIP_STYLE = {
  background: 'var(--surface-3)',
  border: '1px solid var(--surface-4)',
  color: 'var(--text-1)',
} as const

export const CURSOR_STYLE = { fill: 'var(--surface-3)' } as const

export const GRID_STROKE = 'var(--surface-4)'

export const BAR_CATEGORY_GAP = '30%'

export const PIE_LABEL_TEXT_COLOR = 'var(--text-1)'
export const DEFAULT_PIE_PROPS = {
  cornerRadius: 10,
  stroke: 'var(--surface-3)',
  innerRadius: '50%',
  outerRadius: '80%',
  labelLine: false,
} as const satisfies Partial<PieProps>

export function formatYearTick(year: number): string {
  return `'${String(year).slice(-2)}`
}

export function formatPercentageTick(value: number): string {
  return `${Math.round(value * 100)}%`
}
