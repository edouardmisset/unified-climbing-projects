import { createTrainingSessionFingerprintInput } from '~/domain/canonical/fingerprint-input'
import {
  trainingSessionPublicInputSchema,
  trainingSessionPublicOutputSchema,
} from '~/domain/canonical/training-session'
import { zodToConvex } from 'convex-helpers/server/zod'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const publicTrainingInputValidator = zodToConvex(trainingSessionPublicInputSchema)

function toPublicTrainingSession(record: unknown) {
  return trainingSessionPublicOutputSchema.parse(record)
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const { subject } = await requireIdentity(ctx)
    const records = await ctx.db
      .query('training')
      .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
      .collect()
    return records.map(toPublicTrainingSession)
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
    return await ctx.db.insert('training', {
      ...args,
      contentFingerprint,
      ownerId: subject,
    })
  },
})

export const getById = query({
  args: { id: v.id('training') },
  handler: async (ctx, { id }) => {
    const { subject } = await requireIdentity(ctx)
    const record = await ctx.db.get(id)
    if (!record || !('ownerId' in record) || record.ownerId !== subject)
      throw new ConvexError('Training session not found')
    return toPublicTrainingSession(record)
  },
})
