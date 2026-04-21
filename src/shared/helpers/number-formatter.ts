import { FR_LOCALE, US_LOCALE } from '~/shared/constants/generic'

type NumberFormatUnit = NonNullable<Intl.NumberFormatOptions['unit']>

const DEFAULT_NUMBER_FORMAT_OPTIONS = {
  useGrouping: true,
} as const satisfies Intl.NumberFormatOptions

const numberFormatterCache = new Map<string, Intl.NumberFormat>()

function buildCacheKey(options: Intl.NumberFormatOptions): string {
  return JSON.stringify(
    Object.entries(options).toSorted(([left], [right]) => left.localeCompare(right)),
  )
}

function getNumberFormatter(
  options: Intl.NumberFormatOptions & { locale?: string } = { locale: FR_LOCALE },
): Intl.NumberFormat {
  const normalizedOptions = {
    ...DEFAULT_NUMBER_FORMAT_OPTIONS,
    locale: options.locale ?? FR_LOCALE,
    ...options,
  } satisfies Intl.NumberFormatOptions

  const cacheKey = buildCacheKey(normalizedOptions)
  const cachedFormatter = numberFormatterCache.get(cacheKey)
  if (cachedFormatter) return cachedFormatter

  const formatter = new Intl.NumberFormat(normalizedOptions.locale, normalizedOptions)
  numberFormatterCache.set(cacheKey, formatter)
  return formatter
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return getNumberFormatter(options).format(value)
}

export function formatWholePercent(value: number, options?: Intl.NumberFormatOptions): string {
  return getNumberFormatter({
    maximumFractionDigits: 0,
    style: 'percent',
    ...options,
  }).format(value / 100)
}

export function formatRatioAsPercent(value: number, options?: Intl.NumberFormatOptions): string {
  return getNumberFormatter({
    maximumFractionDigits: 0,
    style: 'percent',
    ...options,
  }).format(value)
}

export function formatUnit(
  value: number,
  unit: NumberFormatUnit,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'unit'>,
): string {
  return getNumberFormatter({
    style: 'unit',
    unit,
    locale: US_LOCALE,
    ...options,
  }).format(value)
}

export const frenchNumberFormatter = getNumberFormatter()
