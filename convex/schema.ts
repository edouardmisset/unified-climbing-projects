import { defineSchema, defineTable } from 'convex/server'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { ascentStoredFieldsSchema } from '~/domain/canonical/ascent'
import {
  legacyAscentSchema,
  legacyTrainingSessionSchema,
} from '~/domain/canonical/legacy-transformers'
import { trainingSessionStoredFieldsSchema } from '~/domain/canonical/training-session'

const legacyAscentValidator = zodToConvex(
  legacyAscentSchema.omit({ _creationTime: true, _id: true }),
)
const legacyTrainingValidator = zodToConvex(
  legacyTrainingSessionSchema.omit({ _creationTime: true, _id: true }),
)

export const canonicalAscentValidator = zodToConvex(ascentStoredFieldsSchema)
export const canonicalTrainingSessionValidator = zodToConvex(trainingSessionStoredFieldsSchema)
const widenedAscentValidator = v.union(canonicalAscentValidator, legacyAscentValidator)
const widenedTrainingValidator = v.union(canonicalTrainingSessionValidator, legacyTrainingValidator)
const importKindValidator = v.union(v.literal('ascents'), v.literal('training'))
const importStatusValidator = v.union(
  v.literal('pending'),
  v.literal('running'),
  v.literal('completed'),
  v.literal('failed'),
  v.literal('undone'),
)

export default defineSchema({
  // Widened for the one-time in-place migration. Public functions only expose
  // owner-scoped canonical documents.
  ascents: defineTable(widenedAscentValidator)
    .index('by_owner', ['ownerId'])
    .index('by_owner_fingerprint', ['ownerId', 'contentFingerprint'])
    .index('by_owner_import_job', ['ownerId', 'importJobId']),
  training: defineTable(widenedTrainingValidator)
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
