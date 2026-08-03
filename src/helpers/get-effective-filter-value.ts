import { ALL_VALUE } from '~/app/_components/dashboard/constants'

/**
 * Falls back to `ALL_VALUE` when `selectedValue` is no longer among `options`
 * (e.g. after upstream filters have narrowed the available choices).
 */
export function getEffectiveFilterValue<T extends string>(
  options: readonly T[],
  selectedValue: string,
): T | typeof ALL_VALUE {
  return (options as readonly string[]).includes(selectedValue) ? (selectedValue as T) : ALL_VALUE
}
