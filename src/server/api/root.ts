import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'
import { areasRouter } from './routers/areas.ts'
import { ascentsRouter } from './routers/ascents.ts'
import { cragsRouter } from './routers/crags.ts'
import { gradesRouter } from './routers/grades.ts'
import { trainingRouter } from './routers/training.ts'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  areas: areasRouter,
  ascents: ascentsRouter,
  crags: cragsRouter,
  grades: gradesRouter,
  training: trainingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.ascents.getAllAscents();
 *       ^? Ascents[]
 */
export const createCaller = createCallerFactory(appRouter)
