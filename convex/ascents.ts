import { ascentPublicInputSchema, ascentPublicOutputSchema } from '~/domain/canonical/ascent'
import { createAscentFingerprintInput } from '~/domain/canonical/fingerprint-input'
import { zodToConvex } from 'convex-helpers/server/zod'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const publicAscentInputValidator = zodToConvex(ascentPublicInputSchema)

function toPublicAscent(record: unknown) {
  return ascentPublicOutputSchema.parse(record)
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const { subject } = await requireIdentity(ctx)
    const records = await ctx.db
      .query('ascents')
      .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
      .collect()
    return records.map(toPublicAscent)
  },
})

export const post = mutation({
  args: publicAscentInputValidator,
  returns: v.id('ascents'),
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const contentFingerprint = await createContentFingerprint(createAscentFingerprintInput(args))
    return await ctx.db.insert('ascents', {
      ...args,
      contentFingerprint,
      ownerId: subject,
    })
  },
})

export const getById = query({
  args: { id: v.id('ascents') },
  handler: async (ctx, { id }) => {
    const { subject } = await requireIdentity(ctx)
    const record = await ctx.db.get(id)
    if (!record || !('ownerId' in record) || record.ownerId !== subject)
      throw new ConvexError('Ascent not found')
    return toPublicAscent(record)
  },
})
