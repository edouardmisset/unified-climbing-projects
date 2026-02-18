import { US_LOCALE } from '~/constants/generic'

export const DATE_TIME_OPTIONS = {
  longDate: {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  },
  longDateTime: {
    dateStyle: 'long',
    timeStyle: 'medium',
  },
  mediumDate: {
    dateStyle: 'medium',
  },
  shortDate: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  },
  shortDateTime: {
    dateStyle: 'short',
    timeStyle: 'short',
  },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

/**
 * Formats the provided date using the specified date time options.
 *
 * @param {Date} date - The date to format
 * @param {keyof typeof DATE_TIME_OPTIONS} [options='fullDateTime'] - The format
 * option key from DATE_TIME_OPTIONS
 * @returns {string} The formatted date string
 */
export const buildDateTimeFormat = (
  options: keyof typeof DATE_TIME_OPTIONS = 'longDateTime',
): ((date: string) => string) => {
  const formatter = new Intl.DateTimeFormat(
    options === 'shortDate' ? 'fr-FR' : US_LOCALE,
    DATE_TIME_OPTIONS[options],
  )

  return date => formatter.format(new Date(date))
}
