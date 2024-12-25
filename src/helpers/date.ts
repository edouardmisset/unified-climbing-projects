import { frequencyBy } from './frequency-by'
import { sortNumericalValues } from './sort-values'

const localeIdentifier = 'en-US'

const MILLISECONDS_IN_WEEK = 604_800_000
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

export const DATE_TIME_OPTIONS = {
  fullDateTime: {
    dateStyle: 'full',
    timeStyle: 'medium',
  },
  shortDateTime: {
    weekday: 'short',
    hour: 'numeric',
  },
  shortDate: {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  },
  longDate: {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

export const formatDateTime = (
  date: Date,
  options: keyof typeof DATE_TIME_OPTIONS = 'fullDateTime',
): string => {
  return new Intl.DateTimeFormat(
    localeIdentifier,
    DATE_TIME_OPTIONS[options],
  ).format(date)
}

export const getWeek = (date: Date): number => {
  const firstDayOfWeek = 1 // Monday as the first day (0 = Sunday)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  startOfYear.setDate(
    startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7)),
  )
  return (
    Math.round(
      (date.getTime() - startOfYear.getTime()) / MILLISECONDS_IN_WEEK,
    ) + 1
  )
}

export const getWeeksInYear = (year: number): number => {
  const firstMondayThisYear = new Date(
    +year,
    0,
    5 - (new Date(+year, 0, 4).getDay() || 7),
  )

  const firstMondayNextYear = new Date(
    +year + 1,
    0,
    5 - (new Date(+year + 1, 0, 4).getDay() || 7),
  )

  return (
    (firstMondayNextYear.getTime() - firstMondayThisYear.getTime()) /
    MILLISECONDS_IN_WEEK
  )
}

export const getDayOfYear = (date: Date): number => {
  const newDate = new Date(date)
  return Math.floor(
    (newDate.getTime() - new Date(newDate.getFullYear(), 0, 0).getTime()) /
      MILLISECONDS_IN_DAY,
  )
}

export const isLeftDateBefore = (leftDate: Date, rightDate: Date) => {
  return leftDate < rightDate
}

export function getMostFrequentDate<
  Type extends { date: string; [k: string]: string | number },
>(data: Type[]): [string, number] {
  const ascentsByDate = frequencyBy(data, 'date')
  const sortedAscentsByDate = sortNumericalValues(ascentsByDate, {
    ascending: false,
  })
  return (Object.entries(sortedAscentsByDate)[0] ?? ['', 0]) as [string, number]
}
