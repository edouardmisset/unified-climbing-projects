import { NoOp } from 'convex-helpers/server/customFunctions'
import { zCustomQuery } from 'convex-helpers/server/zod'
import { filterAscents } from '~/helpers/filter-ascents'
import { ascentSchema } from '~/schema/ascent'
import { optionalAscentFilterSchema } from '~/types/optional-ascent-filter'
import { mutation, query } from './_generated/server'
import { convexPostAscentSchema } from './schema'

const zQuery = zCustomQuery(query, NoOp)

export const get = zQuery({
  args: { options: optionalAscentFilterSchema },
  handler: async (ctx, { options }) => {
    const output = await ctx.db.query('ascents').collect()

    const result = ascentSchema.array().safeParse(output)
    if (!result.success) {
      globalThis.console.error('Invalid ascent data', result.error)
      return []
    }

    return filterAscents(result.data, options)
  },
})

export const post = mutation({
  args: convexPostAscentSchema,
  handler: async (ctx, args) => await ctx.db.insert('ascents', args),
})
