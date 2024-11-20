import { getAllTrainingSessions } from '~/services/training'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const trainingRouter = createTRPCRouter({
  getAllTrainingSessions: publicProcedure.query(async () => {
    return await getAllTrainingSessions()
  }),
})
