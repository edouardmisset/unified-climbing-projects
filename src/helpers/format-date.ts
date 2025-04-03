import { US_LOCALE } from '~/constants/generic'

export const DATE_TIME_OPTIONS = {
  longDateTime: {
    dateStyle: 'long',
    timeStyle: 'medium',
  },
  shortDateTime: {
    dateStyle: 'short',
    timeStyle: 'short',
  },
  shortDate: {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  },
  mediumDate: {
    dateStyle: 'medium',
  },
  longDate: {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

/**
 * Formats the provided date using the specified date time options.
 *
 * @param {Date} date - The date to format
 * @param {keyof typeof DATE_TIME_OPTIONS} [options='fullDateTime'] - The format option key from DATE_TIME_OPTIONS
 * @returns {string} The formatted date string
 */
export const formatDateTime = (
  date: Date,
  options: keyof typeof DATE_TIME_OPTIONS = 'longDateTime',
): string => {
  return new Intl.DateTimeFormat(US_LOCALE, DATE_TIME_OPTIONS[options]).format(
    date,
  )
}
