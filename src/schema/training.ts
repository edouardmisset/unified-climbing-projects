import type { TrainingSessionRecord } from '~/domain/training-session'
import { z } from 'zod'

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export const loadCategorySchema = z.enum(LOAD_CATEGORIES)
export type LoadCategory = z.infer<typeof loadCategorySchema>

export type TrainingSession = TrainingSessionRecord

export type TrainingSessionListProps = {
  trainingSessions: TrainingSession[]
}
