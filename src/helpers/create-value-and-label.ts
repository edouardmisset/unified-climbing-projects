import type { ValueAndLabel } from '~/types/generic'

export function createValueAndLabel(
  values: string[] | readonly string[] | undefined,
): ValueAndLabel[] {
  return values?.map(value => ({ value, label: value })) ?? []
}
