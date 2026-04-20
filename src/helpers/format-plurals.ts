import { US_LOCALE } from '~/constants/generic'
import { formatNumber } from './number-formatter'

const englishCardinalRules = new Intl.PluralRules(US_LOCALE)
const englishOrdinalRules = new Intl.PluralRules(US_LOCALE, { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])

type EnglishPluralForms = {
  one: string
  other: string
}

export function selectEnglishPluralForm<T extends EnglishPluralForms>(
  number_: number,
  forms: T,
): T['one'] | T['other'] {
  return englishCardinalRules.select(number_) === 'one' ? forms.one : forms.other
}

export function formatCountWithEnglishNoun(number_: number, forms: EnglishPluralForms): string {
  return `${formatNumber(number_)} ${selectEnglishPluralForm(number_, forms)}`
}

/**
 * Format a number with its ordinal suffix (1st, 2nd, 3rd, 4th, etc.) in
 * English.
 * @param number_ - The number to format
 * @returns The formatted number with its ordinal suffix
 */
export function formatOrdinals(number_: number) {
  const rule = englishOrdinalRules.select(number_)
  const suffix = suffixes.get(rule) ?? suffixes.get('other')
  return `${formatNumber(number_, { useGrouping: false })}${suffix}`
}
