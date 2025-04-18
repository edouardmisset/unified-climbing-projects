import { z } from 'zod'

export const errorSchema = z.object({ error: z.string() })
export type CustomError = z.infer<typeof errorSchema>

export const timeframes = ['year', 'last-12-months', 'all-time'] as const
export const timeframeSchema = z.enum(timeframes)
export type Timeframe = z.infer<typeof timeframeSchema>

export const optionalAscentYear = z
  .number()
  .int()
  .min(1900, 'Year of ascent must be 1900 or later')
  .optional()

export const positiveInteger = z.number().int().min(0)
export const percentSchema = z.number().int().min(0).max(100)
