import { trainingSessionSchema } from '~/schema/training'
import { api } from './_generated/api'
import { action, mutation, query } from './_generated/server'
import { convexPostTrainingSessionSchema } from './schema'

export const get = query({
  args: {},
  handler: async ctx => {
    const trainingRecords = await ctx.db.query('training').collect()

    const validatedTrainingSessions = trainingSessionSchema
      .array()
      .safeParse(trainingRecords)
    if (!validatedTrainingSessions.success) {
      globalThis.console.error(
        'Invalid training session data',
        validatedTrainingSessions.error,
      )
      return []
    }

    return validatedTrainingSessions.data
  },
})

export const getYears = query({
  args: {},
  handler: async ctx => {
    const trainingRecords = await ctx.db.query('training').collect()
    const years = new Set(
      trainingRecords.map(r => new Date(r.date).getFullYear()),
    )
    return Array.from(years).sort((a, b) => b - a)
  },
})

export const post = mutation({
  args: convexPostTrainingSessionSchema,
  handler: async (ctx, args) => await ctx.db.insert('training', args),
})

export const postAction = action({
  args: convexPostTrainingSessionSchema,
  handler: async (ctx, args): Promise<null> =>
    (await ctx.runMutation(api.training.post, args)) as unknown as null,
})
