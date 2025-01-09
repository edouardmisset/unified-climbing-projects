import { z } from 'zod'

export const errorSchema = z.object({ error: z.string() })
export type CustomError = z.infer<typeof errorSchema>
