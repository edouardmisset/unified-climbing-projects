import { z } from 'zod'

export const errorSchema = z.object({ error: z.string() })
export type CustomError = z.infer<typeof errorSchema>

export const timeframes = ['year', '12-months', 'all-time'] as const
export const timeframeSchema = z.enum(timeframes)
export type Timeframe = z.infer<typeof timeframeSchema>
