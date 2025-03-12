import { boolean, number, z } from 'zod'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { trainingSessionSchema } from '~/schema/training'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { addTrainingSession, getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  getAllTrainingSessions: publicProcedure
    .input(z.object({ year: number().optional() }).optional())
    .output(trainingSessionSchema.array())
    .query(async ({ input }) => {
      const allTrainingSessions = await getAllTrainingSessions()
      return filterTrainingSessions(allTrainingSessions, input)
    }),
  getLatestTrainingSession: publicProcedure
    .output(trainingSessionSchema)
    .query(async () => {
      const allTrainingSessions = await getAllTrainingSessions()
      const latestTrainingSession = allTrainingSessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]
      if (!latestTrainingSession) {
        throw new Error('No training sessions found')
      }
      return latestTrainingSession
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
