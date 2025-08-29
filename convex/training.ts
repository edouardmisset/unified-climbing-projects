import { mutation, query } from './_generated/server'
import { convexPostTrainingSessionSchema } from './schema'

export const get = query({
  args: {},
  handler: async ctx => await ctx.db.query('training').collect(),
})

export const post = mutation({
  args: convexPostTrainingSessionSchema,
  handler: async (ctx, args) => await ctx.db.insert('training', args),
})
