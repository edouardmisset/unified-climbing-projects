import { boolean, number, z } from 'zod'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { trainingSessionSchema } from '~/schema/training'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addTrainingSession, getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          year: number().int().positive().optional(),
          sessionType: trainingSessionSchema.shape.sessionType.optional(),
        })
        .optional(),
    )
    .output(trainingSessionSchema.array())
    .query(async ({ input }) => {
      const allTrainingSessions = await getAllTrainingSessions()
      const filteredTrainingSessions = filterTrainingSessions(
        allTrainingSessions,
        input,
      )
      return filteredTrainingSessions.sort(
        ({ date: leftDate }, { date: rightDate }) => {
          if (leftDate === rightDate) return 0

          return new Date(leftDate) < new Date(rightDate) ? 1 : -1
        },
      )
    }),
  getLatest: publicProcedure.output(trainingSessionSchema).query(async () => {
    const allTrainingSessions = await getAllTrainingSessions()
    const [latestTrainingSession] = allTrainingSessions.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    if (!latestTrainingSession) {
      throw new Error('No training sessions found')
    }
    return latestTrainingSession
  }),
  getAllLocations: publicProcedure
    .output(z.array(trainingSessionSchema.shape.gymCrag))
    .query(async () => {
      const allTrainingSessions = await getAllTrainingSessions()
      return [
        ...new Set(
          allTrainingSessions
            .map(({ gymCrag }) => gymCrag?.trim())
            .filter(Boolean)
            .sort(compareStringsAscending),
        ),
      ]
    }),
  addOne: publicProcedure
    .input(trainingSessionSchema.omit({ id: true }))
    .output(boolean())
    .mutation(async ({ input: trainingSession }) => {
      try {
        await addTrainingSession(trainingSession)
        return true
      } catch (error) {
        globalThis.console.error(error)
        return false
      }
    }),
})
