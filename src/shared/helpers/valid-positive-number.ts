import { validNumberWithFallback } from '@edouardmisset/math'

export function validPositiveNumber(value: unknown, fallback: number) {
  const val = validNumberWithFallback(value, fallback)
  return val <= 0 ? fallback : val
}
