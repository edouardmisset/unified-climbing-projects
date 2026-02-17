import { ALL_VALUE } from '~/app/_components/dashboard/constants'

/**
 * Converts the "all" filter value to undefined for use with filter functions.
 *
 * @param value - The filter value, which can be a specific value or "all"
 * @returns The original value if not "all", otherwise undefined
 */
export function normalizeFilterValue<T extends string>(value: T | typeof ALL_VALUE): T | undefined {
  return value === ALL_VALUE ? undefined : (value)
}
