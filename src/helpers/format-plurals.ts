import { US_LOCALE } from '~/constants/generic'

const englishOrdinalRules = new Intl.PluralRules(US_LOCALE, { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])

/**
 * Format a number with its ordinal suffix (1st, 2nd, 3rd, 4th, etc.) in
 * English.
 * @param number_ - The number to format
 * @returns The formatted number with its ordinal suffix
 */
export function formatOrdinals(number_: number) {
  const rule = englishOrdinalRules.select(number_)
  const suffix = suffixes.get(rule)
  return `${number_}${suffix}`
}
