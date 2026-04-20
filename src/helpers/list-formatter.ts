import { FR_LOCALE, US_LOCALE } from '~/constants/generic'

/**
 * Creates a list formatter using Intl.ListFormat.
 *
 * @param {Intl.ListFormatOptions} options - Options to configure the list
 * formatter.
 * @returns {(list: string[] | readonly string[]) => string} A function that
 * formats a list based on the specified options.
 */
function createListFormatter(
  options: Intl.ListFormatOptions,
  locale: string = US_LOCALE,
): (list: string[] | readonly string[]) => string {
  const formatter = new Intl.ListFormat(locale, options)
  return list => formatter.format(list)
}

/**
 * Formats a list of items using disjunctive (or) grouping.
 * Example: "A, B, or C"
 *
 * @param {string[] | readonly string[]} list - The list of strings to format.
 * @returns {string} The formatted list string.
 */
export const disjunctiveListFormatter = createListFormatter(
  {
    style: 'long',
    type: 'disjunction',
  },
  US_LOCALE,
)

/**
 * Formats a list of items using conjunctive (and) grouping.
 * Example: "A, B, and C"
 *
 * @param {string[] | readonly string[]} list - The list of strings to format.
 * @returns {string} The formatted list string.
 */
export const conjunctiveListFormatter = createListFormatter(
  {
    style: 'long',
    type: 'conjunction',
  },
  US_LOCALE,
)

/**
 * Formats a list of items using conjunctive (et) grouping in French.
 * Example: "A, B et C"
 *
 * @param {string[] | readonly string[]} list - The list of strings to format.
 * @returns {string} The formatted list string.
 */
export const frenchConjunctiveListFormatter = createListFormatter(
  {
    style: 'long',
    type: 'conjunction',
  },
  FR_LOCALE,
)
