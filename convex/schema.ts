import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { ascentSchema } from '~/schema/ascent'
import { trainingSessionSchema } from '~/schema/training'

export const convexGetAscentSchema = zodToConvex(ascentSchema)
export const convexPostAscentSchema = zodToConvex(
  ascentSchema.omit({ _id: true }),
)

export const convexGetTrainingSessionSchema = zodToConvex(trainingSessionSchema)
export const convexPostTrainingSessionSchema = zodToConvex(
  trainingSessionSchema.omit({ _id: true }),
)

export default defineSchema({
  ascents: defineTable(convexGetAscentSchema),
  training: defineTable(convexGetTrainingSessionSchema),
})
