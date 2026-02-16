import { ascentSchema } from '~/schema/ascent'
import { api } from './_generated/api'
import { action, mutation, query } from './_generated/server'
import { convexPostAscentSchema } from './schema'

export const get = query({
  args: {},
  handler: async ctx => {
    const ascentRecords = await ctx.db.query('ascents').collect()

    const validatedAscents = ascentSchema.array().safeParse(ascentRecords)
    if (!validatedAscents.success) {
      globalThis.console.error('Invalid ascent data', validatedAscents.error)
      return []
    }

    return validatedAscents.data
  },
})

export const post = mutation({
  args: convexPostAscentSchema,
  handler: async (ctx, args) => await ctx.db.insert('ascents', args),
})

export const postAction = action({
  args: convexPostAscentSchema,
  handler: async (ctx, args): Promise<null> =>
    (await ctx.runMutation(api.ascents.post, args)) as unknown as null,
})
