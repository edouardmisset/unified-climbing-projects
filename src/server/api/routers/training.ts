import { filterTrainingSessions } from '~/helpers/filter-training'
import { sortByDate } from '~/helpers/sort-by-date'
import { compareStringsAscending } from '~/helpers/sort-strings'
import { z } from '~/helpers/zod'
import { optionalAscentYear } from '~/schema/generic'
import { trainingSessionSchema } from '~/schema/training'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addTrainingSessionToDB } from '~/services/convex'
import { getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  addOne: publicProcedure
    .input(trainingSessionSchema.omit({ _id: true }))
    .output(z.boolean())
    .mutation(async ({ input: trainingSession }) => {
      try {
        await addTrainingSessionToDB(trainingSession)
        return true
      } catch (error) {
        globalThis.console.error('Error adding training session:', error)
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
      return filteredTrainingSessions.sort(sortByDate)
    }),
  getAllLocations: publicProcedure
    .output(z.array(trainingSessionSchema.required().shape.gymCrag))
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
