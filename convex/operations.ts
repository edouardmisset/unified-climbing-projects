import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalAction, internalMutation, internalQuery } from './_generated/server'

const tableValidator = v.union(v.literal('ascents'), v.literal('training'), v.literal('importJobs'))
const MAX_BATCH_SIZE = 100

export const countOwnerData = internalQuery({
  args: { ownerId: v.string() },
  handler: async (ctx, { ownerId }) => {
    const [ascents, training, importJobs] = await Promise.all([
      ctx.db
        .query('ascents')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', ownerId))
        .collect(),
      ctx.db
        .query('training')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', ownerId))
        .collect(),
      ctx.db
        .query('importJobs')
        .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', ownerId))
        .collect(),
    ])
    return {
      ascents: ascents.length,
      importJobs: importJobs.length,
      training: training.length,
    }
  },
})

export const deleteOwnerBatch = internalMutation({
  args: {
    batchSize: v.optional(v.number()),
    ownerId: v.string(),
    table: tableValidator,
  },
  handler: async (ctx, args) => {
    const batchSize = Math.min(Math.max(args.batchSize ?? MAX_BATCH_SIZE, 1), MAX_BATCH_SIZE)
    const records = await ctx.db
      .query(args.table)
      .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', args.ownerId))
      .take(batchSize)
    await Promise.all(records.map(async (record) => await ctx.db.delete(record._id)))
    return records.length
  },
})

export const deleteOwnerData = internalAction({
  args: {
    batchSize: v.optional(v.number()),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const deleted = { ascents: 0, importJobs: 0, training: 0 }
    for (const table of ['ascents', 'training', 'importJobs'] as const) {
      let batchCount = 0
      do {
        // Deletion is intentionally sequential so each mutation remains bounded.
        // eslint-disable-next-line no-await-in-loop
        batchCount = await ctx.runMutation(internal.operations.deleteOwnerBatch, {
          batchSize: args.batchSize,
          ownerId: args.ownerId,
          table,
        })
        deleted[table] += batchCount
      } while (batchCount > 0)
    }
    return deleted
  },
})
