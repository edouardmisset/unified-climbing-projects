import { US_LOCALE } from '~/constants/generic'
import { formatUnit } from './number-formatter'

const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30

const DURATION_UNITS = [
  {
    days: DAYS_IN_MONTH,
    unit: 'month',
  },
  {
    days: DAYS_IN_WEEK,
    unit: 'week',
  },
  {
    days: 1,
    unit: 'day',
  },
] as const

const DURATION_FORMAT_KEYS = {
  day: 'days',
  month: 'months',
  week: 'weeks',
} as const

type DurationPart = {
  value: number
  unit: (typeof DURATION_UNITS)[number]['unit']
}

type DurationFormatInput = {
  days?: number
  months?: number
  weeks?: number
}

const usDurationFormatter = new Intl.DurationFormat(US_LOCALE, { style: 'long' })

function getDurationParts(totalDays: number): DurationPart[] {
  let remainingDays = Math.round(totalDays)
  const parts: DurationPart[] = []

  for (const { days, unit } of DURATION_UNITS) {
    const value = unit === 'day' ? remainingDays : Math.floor(remainingDays / days)
    if (value <= 0) continue

    parts.push({ unit, value })
    remainingDays -= value * days
  }

  return parts
}

function fromDurationPartsToDurationFormatInput(
  durationParts: DurationPart[],
): DurationFormatInput {
  const formattedDuration: DurationFormatInput = {}

  for (const { unit, value } of durationParts) formattedDuration[DURATION_FORMAT_KEYS[unit]] = value

  return formattedDuration
}

export function formatFrenchDurationFromDays(totalDays: number): string {
  const durationFormatOptions = { unitDisplay: 'long' } as const satisfies Intl.NumberFormatOptions
  if (!Number.isFinite(totalDays) || totalDays <= 0)
    return formatUnit(0, 'day', durationFormatOptions)

  const durationParts = getDurationParts(totalDays).slice(0, 2)
  if (durationParts.length === 0) return formatUnit(0, 'day', durationFormatOptions)

  return usDurationFormatter.format(fromDurationPartsToDurationFormatInput(durationParts))
}
