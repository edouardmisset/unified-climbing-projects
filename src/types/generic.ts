import type { Temporal } from '@js-temporal/polyfill'

type DataResponse = {
  data: unknown
}

export const isDataResponse = (json: unknown): json is DataResponse =>
  typeof json === 'object' && json !== null && 'data' in json

export type TemporalDate = { date: Temporal.PlainDate }
