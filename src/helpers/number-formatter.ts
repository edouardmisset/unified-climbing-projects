import { US_LOCALE } from '~/constants/generic'

type NumberFormatOptions = Intl.NumberFormatOptions
type NumberFormatUnit = NonNullable<NumberFormatOptions['unit']>

const DEFAULT_NUMBER_FORMAT_OPTIONS = {
  useGrouping: true,
} as const satisfies NumberFormatOptions

const numberFormatterCache = new Map<string, Intl.NumberFormat>()

function buildCacheKey(options: NumberFormatOptions): string {
  return JSON.stringify(
    Object.entries(options).toSorted(([left], [right]) => left.localeCompare(right)),
  )
}

function getNumberFormatter(options: NumberFormatOptions = {}): Intl.NumberFormat {
  const normalizedOptions = {
    ...DEFAULT_NUMBER_FORMAT_OPTIONS,
    ...options,
  } satisfies NumberFormatOptions

  const cacheKey = buildCacheKey(normalizedOptions)
  const cachedFormatter = numberFormatterCache.get(cacheKey)
  if (cachedFormatter) return cachedFormatter

  const formatter = new Intl.NumberFormat(US_LOCALE, normalizedOptions)
  numberFormatterCache.set(cacheKey, formatter)
  return formatter
}

export function formatNumber(value: number, options?: NumberFormatOptions): string {
  return getNumberFormatter(options).format(value)
}

export function formatWholePercent(value: number, options?: NumberFormatOptions): string {
  return getNumberFormatter({
    maximumFractionDigits: 0,
    style: 'percent',
    ...options,
  }).format(value / 100)
}

export function formatRatioAsPercent(value: number, options?: NumberFormatOptions): string {
  return getNumberFormatter({
    maximumFractionDigits: 0,
    style: 'percent',
    ...options,
  }).format(value)
}

export function formatUnit(
  value: number,
  unit: NumberFormatUnit,
  options?: Omit<NumberFormatOptions, 'style' | 'unit'>,
): string {
  return getNumberFormatter({
    style: 'unit',
    unit,
    ...options,
  }).format(value)
}

export const frenchNumberFormatter = getNumberFormatter()
