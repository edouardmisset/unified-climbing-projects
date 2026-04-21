import type { ValueAndLabel } from '~/shared/types'

export function createValueAndLabel(
  values: string[] | readonly string[] | undefined,
): ValueAndLabel[] {
  return values?.map(value => ({ value, label: value })) ?? []
}
