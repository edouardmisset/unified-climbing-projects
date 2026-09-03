import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math'
import 'temporal-polyfill/global'
import 'temporal-polyfill/types/global'
import type { OrAll } from '~/app/_components/dashboard/types'
import { PERIOD_TO_DATES, type Period } from '~/schema/generic'
import { normalizeFilterValue } from './normalize-filter-value'

type DateRange = { startDate: Date; endDate: Date }

function toUtcDate(plainDate: Temporal.PlainDate): Date {
  return new Date(plainDate.toZonedDateTime('UTC').epochMilliseconds)
}

function getTrailingRange(duration: Temporal.DurationLike): DateRange {
  const today = Temporal.Now.plainDateISO()

  return {
    startDate: toUtcDate(today.subtract(duration)),
    // Last instant of today, so entries logged today match and future ones never do
    endDate: new Date(toUtcDate(today.add({ days: 1 })).getTime() - 1),
  }
}

const PERIOD_TO_RANGE = {
  'Last month': () => getTrailingRange({ months: 1 }),
  'Last year': () => getTrailingRange({ years: 1 }),
  Unemployment: () => PERIOD_TO_DATES.Unemployment,
  'Road-Trip': () => PERIOD_TO_DATES['Road-Trip'],
} as const satisfies Record<Period, () => DateRange>

export function isDateInPeriod(date: Date, period: Period | undefined): boolean {
  return period === undefined || isDateInRange(date, PERIOD_TO_RANGE[period]())
}

/**
 * `year` and `period` are two encodings of the same date filter, so at most one
 * applies. A period wins over a year left over from an older URL.
 */
export function resolveDateSelection(
  selectedYear: string,
  selectedPeriod: OrAll<Period>,
): { period: Period | undefined; year: number | undefined } {
  const period = normalizeFilterValue(selectedPeriod)
  if (period !== undefined) return { period, year: undefined }

  const year = Number(selectedYear)
  return { period: undefined, year: isValidNumber(year) ? year : undefined }
}
