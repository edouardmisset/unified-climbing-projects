import {
  ascentListOutputSchema,
  ascentPublicInputSchema,
  ascentPublicOutputSchema,
  ascentStoredDocumentSchema,
} from '~/domain/ascent'
import { omitServerControlledFields } from '~/domain/common'
import { createAscentFingerprintInput } from '~/domain/fingerprint-input'
import { zodToConvex } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const publicAscentInputValidator = zodToConvex(ascentPublicInputSchema)

function toPublicAscent(record: unknown) {
  return ascentPublicOutputSchema.parse(
    omitServerControlledFields(ascentStoredDocumentSchema.parse(record)),
  )
}

function toPublicAscentListItem(record: unknown) {
  const { comments: _comments, ...ascent } = toPublicAscent(record)
  return ascent
}

export const get = query({
  args: {},
  returns: v.array(zodToConvex(ascentListOutputSchema)),
  handler: async ctx => {
    const { subject } = await requireIdentity(ctx)
    const records = await ctx.db
      .query('ascents')
      .withIndex('by_owner', queryBuilder => queryBuilder.eq('ownerId', subject))
      .collect()
    return records.map(record => toPublicAscentListItem(record))
  },
})

export const post = mutation({
  args: publicAscentInputValidator,
  returns: v.id('ascents'),
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const contentFingerprint = await createContentFingerprint(createAscentFingerprintInput(args))
    return ctx.db.insert('ascents', {
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
    const normalizedId = ctx.db.normalizeId('ascents', id)
    if (!normalizedId) return
    const record = await ctx.db.get(normalizedId)
    if (!record || record.ownerId !== subject) return
    return toPublicAscent(record)
  },
})
