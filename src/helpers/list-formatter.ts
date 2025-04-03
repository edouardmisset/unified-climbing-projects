import { US_LOCALE } from '~/constants/generic'

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
): (list: string[] | readonly string[]) => string {
  return list => new Intl.ListFormat(US_LOCALE, options).format(list)
}

/**
 * Formats a list of items using disjunctive (or) grouping.
 * Example: "A, B, or C"
 *
 * @param {string[] | readonly string[]} list - The list of strings to format.
 * @returns {string} The formatted list string.
 */
export const disjunctiveListFormatter = createListFormatter({
  type: 'disjunction',
  style: 'long',
})

/**
 * Formats a list of items using conjunctive (and) grouping.
 * Example: "A, B, and C"
 *
 * @param {string[] | readonly string[]} list - The list of strings to format.
 * @returns {string} The formatted list string.
 */
export const conjunctiveListFormatter = createListFormatter({
  type: 'conjunction',
  style: 'long',
})
