import { number, z } from 'zod'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  getAllTrainingSessions: publicProcedure
    .input(z.object({ year: number().optional() }).optional())
    .query(async ({ input }) => {
      const allTrainingSessions = await getAllTrainingSessions()
      return filterTrainingSessions(allTrainingSessions, input)
    }),
})
