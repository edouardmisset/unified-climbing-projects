import { NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery } from 'convex-helpers/server/zod3'
import { filterAscents } from '~/helpers/filter-ascents'
import { ascentSchema } from '~/schema/ascent'
import { optionalAscentFilterSchema } from '~/types/optional-ascent-filter'
import { api } from './_generated/api'
import { action, mutation, query } from './_generated/server'
import { convexPostAscentSchema } from './schema'

const zQuery = zCustomQuery(query, NoOp)

export const get = zQuery({
  args: { options: optionalAscentFilterSchema },
  handler: async (ctx, { options }) => {
    const ascentRecords = await ctx.db.query('ascents').collect()

    const validatedAscents = ascentSchema.array().safeParse(ascentRecords)
    if (!validatedAscents.success) {
      globalThis.console.error('Invalid ascent data', validatedAscents.error)
      return []
    }

    return filterAscents(validatedAscents.data, options)
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
