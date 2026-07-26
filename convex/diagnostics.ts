import { v } from 'convex/values'
import { internalQuery, query } from './_generated/server'
import { requireIdentity } from './auth'

export const ownerCounts = query({
  args: {},
  handler: async (ctx) => {
    const { subject } = await requireIdentity(ctx)
    const [ascents, training, importJobs] = await Promise.all([
      ctx.db
        .query('ascents')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
        .collect(),
      ctx.db
        .query('training')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
        .collect(),
      ctx.db
        .query('importJobs')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
        .collect(),
    ])
    return {
      ascents: ascents.length,
      importJobs: importJobs.length,
      training: training.length,
    }
  },
})

export const reconcile = internalQuery({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    // Intentional full-table scan: this is an `internalQuery` used only for
    // the one-time migration rehearsal/cutover reconciliation (see
    // docs/acceptance-and-isolation.md), not something reachable by clients
    // or run on a schedule. It is not safe to call once the tables grow
    // beyond what fits in a single Convex query's read set.
    const [ascents, training] = await Promise.all([
      ctx.db.query('ascents').collect(),
      ctx.db.query('training').collect(),
    ])
    const records = [...ascents, ...training]
    return {
      ascents: ascents.length,
      missingFingerprints: records.filter(
        (record) =>
          !('contentFingerprint' in record) ||
          typeof record.contentFingerprint !== 'string' ||
          record.contentFingerprint.length === 0,
      ).length,
      ownerless: records.filter(
        (record) => !('ownerId' in record) || typeof record.ownerId !== 'string',
      ).length,
      training: training.length,
      wrongOwner: records.filter((record) => 'ownerId' in record && record.ownerId !== args.ownerId)
        .length,
    }
  },
})
