import { z } from '~/helpers/zod'

export const TIMEFRAMES = ['year', 'last-12-months', 'all-time'] as const
export const timeframeSchema = z.enum(TIMEFRAMES)
export type Timeframe = z.infer<typeof timeframeSchema>

export const optionalAscentYear = z
  .number()
  .int()
  .min(1900, 'Year of ascent must be 1900 or later')
  .optional()

export const positiveInteger = z.number().int().min(0)
export const percentSchema = z.number().int().min(0).max(100)

export const PERIOD = ['Road-Trip', 'Unemployment'] as const
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
} as const satisfies Record<Period, { startDate: Date; endDate: Date }>
