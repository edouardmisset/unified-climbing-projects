import { z } from 'zod'

export const TIMEFRAMES = ['year', 'last-12-months', 'all-time'] as const
export const timeframeSchema = z.enum(TIMEFRAMES)
export type Timeframe = z.infer<typeof timeframeSchema>

export const optionalAscentYear = z
  .number()
  .int()
  .min(1_900, 'Year of ascent must be 1900 or later')
  .optional()

export const positiveInteger = z.number().int().min(0)
export const percentSchema = z.number().int().min(0).max(100)

/** Rolling windows, so their boundaries are computed in `~/helpers/period`, not stored below. */
export const RECENT_PERIOD = ['Last month', 'Last year'] as const
export const SPECIAL_PERIOD = ['Unemployment', 'Road-Trip'] as const
type SpecialPeriod = (typeof SPECIAL_PERIOD)[number]

export const PERIOD = [...RECENT_PERIOD, ...SPECIAL_PERIOD] as const
export const periodSchema = z.enum(PERIOD)
export type Period = z.infer<typeof periodSchema>
export const PERIOD_TO_DATES = {
  'Road-Trip': {
    startDate: new Date('2024-07-27'),
    endDate: new Date('2025-08-20'),
  },
  Unemployment: {
    startDate: new Date('2019-06-01'),
    endDate: new Date('2019-09-10'),
  },
} as const satisfies Record<SpecialPeriod, { startDate: Date; endDate: Date }>
