import type { ALL_VALUE } from './constants'

export type OrAll<T extends string | number> = T | typeof ALL_VALUE
