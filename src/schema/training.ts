import type { TrainingSessionListRecord } from '~/domain/training-session'
import { z } from '~/helpers/zod'

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export const loadCategorySchema = z.enum(LOAD_CATEGORIES)
export type LoadCategory = z.infer<typeof loadCategorySchema>

export type TrainingSession = TrainingSessionListRecord

export type TrainingSessionListProps = {
  trainingSessions: TrainingSession[]
}
