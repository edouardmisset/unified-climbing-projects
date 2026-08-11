import { createTrainingSessionFingerprintInput } from '~/domain/fingerprint-input'
import {
  trainingSessionPublicInputSchema,
  trainingSessionPublicOutputSchema,
  trainingSessionStoredDocumentSchema,
} from '~/domain/training-session'
import { omitServerControlledFields } from '~/domain/common'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const publicTrainingInputValidator = zodToConvex(trainingSessionPublicInputSchema)

function toPublicTrainingSession(record: unknown) {
  return trainingSessionPublicOutputSchema.parse(
    omitServerControlledFields(trainingSessionStoredDocumentSchema.parse(record)),
  )
}

function toPublicTrainingSessionListItem(record: unknown) {
  const { comments: _comments, ...session } = toPublicTrainingSession(record)
  return session
}

export const get = query({
  args: {},
  handler: async ctx => {
    const { subject } = await requireIdentity(ctx)
    const records = await ctx.db
      .query('training')
      .withIndex('by_owner', queryBuilder => queryBuilder.eq('ownerId', subject))
      .collect()
    return records.map(record => toPublicTrainingSessionListItem(record))
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
    const normalizedId = ctx.db.normalizeId('training', id)
    if (!normalizedId) return
    const record = await ctx.db.get(normalizedId)
    if (!record || record.ownerId !== subject) return
    return toPublicTrainingSession(record)
  },
})
