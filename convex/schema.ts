import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { ascentStoredFieldsSchema } from '~/domain/ascent'
import { trainingSessionStoredFieldsSchema } from '~/domain/training-session'

export const canonicalAscentValidator = zodToConvex(ascentStoredFieldsSchema)
export const canonicalTrainingSessionValidator = zodToConvex(trainingSessionStoredFieldsSchema)
const importKindValidator = v.union(v.literal('ascents'), v.literal('training'))
const importStatusValidator = v.union(
  v.literal('pending'),
  v.literal('running'),
  v.literal('undoing'),
  v.literal('completed'),
  v.literal('failed'),
  v.literal('undone'),
)

export default defineSchema({
  ascents: defineTable(canonicalAscentValidator)
    .index('by_owner', ['ownerId'])
    .index('by_owner_fingerprint', ['ownerId', 'contentFingerprint'])
    .index('by_owner_import_job', ['ownerId', 'importJobId']),
  training: defineTable(canonicalTrainingSessionValidator)
    .index('by_owner', ['ownerId'])
    .index('by_owner_fingerprint', ['ownerId', 'contentFingerprint'])
    .index('by_owner_import_job', ['ownerId', 'importJobId']),
  importJobs: defineTable({
    createdAt: v.number(),
    inserted: v.number(),
    kind: importKindValidator,
    ownerId: v.string(),
    skipped: v.number(),
    status: importStatusValidator,
    total: v.number(),
  }).index('by_owner', ['ownerId']),
})
