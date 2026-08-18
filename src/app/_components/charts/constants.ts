import { formatRatioAsPercent } from '~/helpers/number-formatter'

export function formatYearTick(year: unknown): string {
  return typeof year === 'number' || typeof year === 'string'
    ? `'${String(year).slice(-2)}`
    : String(year)
}

export function formatPercentageTick(value: unknown): string {
  return typeof value === 'number' ? formatRatioAsPercent(value) : String(value)
}
