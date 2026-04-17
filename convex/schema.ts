import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { ascentSchema } from '~/schema/ascent'
import { trainingSessionSchema } from '~/schema/training'

const convexGetAscentSchema = zodToConvex(ascentSchema.unwrap())
export const convexPostAscentSchema = zodToConvex(ascentSchema.unwrap().omit({ _id: true }))

const convexGetTrainingSessionSchema = zodToConvex(trainingSessionSchema.unwrap())
export const convexPostTrainingSessionSchema = zodToConvex(
  trainingSessionSchema.unwrap().omit({ _id: true }),
)

export default defineSchema({
  ascents: defineTable(convexGetAscentSchema),
  training: defineTable(convexGetTrainingSessionSchema),
})
