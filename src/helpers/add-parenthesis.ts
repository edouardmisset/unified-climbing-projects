/**
 * Wraps a number in parentheses.
 *
 * Given a number, if it is greater than zero, returns the number as a string
 * wrapped in parentheses.
 * Otherwise, returns an empty string.
 *
 * @param {number} number_ - The number to wrap in parentheses.
 * @returns {string} The number wrapped in parentheses if greater than zero, or
 * an empty string.
 */
export function addParenthesis(number_: number): string {
  if (number_ <= 0) {
    return ''
  }
  return `(${number_})`
}
