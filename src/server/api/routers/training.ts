import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { getAllTrainingSessions } from '~/services/training'

export const trainingRouter = createTRPCRouter({
  getAllTrainingSessions: publicProcedure.query(async () => {
    return await getAllTrainingSessions()
  }),
})
