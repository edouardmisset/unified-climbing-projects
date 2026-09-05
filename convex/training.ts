import { createTrainingSessionFingerprintInput } from '~/domain/fingerprint-input'
import {
  trainingSessionListOutputSchema,
  trainingSessionPublicInputSchema,
  trainingSessionPublicOutputSchema,
  trainingSessionStoredDocumentSchema,
} from '~/domain/training-session'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'
import { getOwnedRecord } from './owned-record'
import { createPublicRecordMapper, omitComments } from './public-record'

const publicTrainingInputValidator = zodToConvex(trainingSessionPublicInputSchema)

const toPublicTrainingSession = createPublicRecordMapper(
  trainingSessionStoredDocumentSchema,
  trainingSessionPublicOutputSchema,
)

export const get = query({
  args: {},
  returns: v.array(zodToConvex(trainingSessionListOutputSchema)),
  handler: async ctx => {
    const { subject } = await requireIdentity(ctx)
    const records = await ctx.db
      .query('training')
      .withIndex('by_owner', queryBuilder => queryBuilder.eq('ownerId', subject))
      .collect()
    return records.map(record => omitComments(toPublicTrainingSession(record)))
  },
})

export const post = mutation({
  args: publicTrainingInputValidator,
  returns: v.id('training'),
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const contentFingerprint = await createContentFingerprint(
      createTrainingSessionFingerprintInput(args),
    )
    return ctx.db.insert('training', {
      ...args,
      contentFingerprint,
      ownerId: subject,
    })
  },
})

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const { subject } = await requireIdentity(ctx)
    const record = await getOwnedRecord(ctx, { id, ownerId: subject, table: 'training' })
    if (!record) return
    return toPublicTrainingSession(record)
  },
})
