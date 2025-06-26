import { z } from 'zod'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { sortByDate } from '~/helpers/sort-by-date'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { optionalAscentYear } from '~/schema/generic'
import { trainingSessionSchema } from '~/schema/training'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addTrainingSession, getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  addOne: publicProcedure
    .input(trainingSessionSchema.omit({ id: true }))
    .output(z.boolean())
    .mutation(async ({ input: trainingSession }) => {
      try {
        await addTrainingSession(trainingSession)
        return true
      } catch (error) {
        globalThis.console.error(error)
        return false
      }
    }),
  getAll: publicProcedure
    .input(
      z
        .object({
          sessionType: trainingSessionSchema.shape.sessionType.optional(),
          year: optionalAscentYear,
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
  getAllLocations: publicProcedure
    .output(z.array(trainingSessionSchema.shape.gymCrag.nonoptional()))
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
  getLatest: publicProcedure.output(trainingSessionSchema).query(async () => {
    const allTrainingSessions = await getAllTrainingSessions()
    const [latestTrainingSession] = allTrainingSessions.sort((a, b) =>
      sortByDate(a, b),
    )
    if (!latestTrainingSession) {
      throw new Error('No training sessions found')
    }
    return latestTrainingSession
  }),
})
