import type { Object_ } from '~/types/generic'

/* Trim whitespace and normalize to NFC */
function trimAndNormalizeString(value: string) {
  return value.trim().normalize('NFC')
}

/** Trim and normalize all string values in an object. This is a shallow pass
 * (only one layer deep).
 *
 * **NOTE**: strings in nested objects are not processed.
 * **NOTE**: this function does not modify the original object; it returns a new
 * object.
 *
 * @param obj - The object to process
 * @returns A new object with trimmed and normalized string values
 * @example
 * ```ts
 * const input = {
 *   name: '  John Doe  ',
 *   email: '  john@example.com  ',
 * }
 * const result = trimAndNormalizeStringsInObject(input)
 * // result is {
 * //   name: 'John Doe',
 * //   email: 'john@example.com',
 * // }
 * ```
 */
export function trimAndNormalizeStringsInObject(obj: Object_): Object_ {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [
        key,
        typeof value === 'string' ? trimAndNormalizeString(value) : value,
      ]
    }),
  )
}
