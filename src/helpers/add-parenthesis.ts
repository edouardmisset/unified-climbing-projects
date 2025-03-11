/**
 * Wraps a number (or string) in parentheses.
 *
 * Given a number, if it is greater than zero, returns the number as a string
 * wrapped in parentheses.
 * Otherwise, returns an empty string.
 *
 * @param {number | string} text - The number (or text) to wrap in parentheses.
 * @returns {string} The number (or string) wrapped in parentheses
 */
export function addParenthesis(text: number | string): string {
  if (typeof text === 'number' && text <= 0) {
    return ''
  }
  if (typeof text === 'string' && text.trim() === '') {
    return ''
  }
  return `(${text})`
}
