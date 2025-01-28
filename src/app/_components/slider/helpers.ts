import { fromGradeToNumber } from '~/helpers/converters'
import type { Grade } from '~/schema/ascent'

export function convertGradeToNumber(
  defaultValue: Grade[] | number[] | undefined,
) {
  return defaultValue === undefined
    ? [0]
    : typeof defaultValue[0] === 'number'
      ? (defaultValue as number[])
      : (defaultValue as Grade[]).map(grade => fromGradeToNumber(grade))
}
