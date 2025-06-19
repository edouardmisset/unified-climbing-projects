import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'

import { env } from '~/env'
import { appRouter } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
    req,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            globalThis.console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            )
          }
        : undefined,
    responseMeta: opts => {
      const { ctx, info, errors, type } = opts
      // assuming you have all your public routes with the keyword `public` in them
      const allPublic = info?.calls?.every(({ path }) =>
        path?.includes('public'),
      )
      // checking that no procedures errored
      const allOk = errors.length === 0
      // checking we're doing a query request
      const isQuery = type === 'query'

      if (!(ctx?.res && allPublic && allOk && isQuery)) return {}

      // cache request for 1 hour + revalidate once every second
      const ONE_HOUR_IN_SECONDS = 60 * 60
      return {
        headers: new Headers([
          [
            'cache-control',
            `s-maxage=1, stale-while-revalidate=${ONE_HOUR_IN_SECONDS}`,
          ],
        ]),
      }
    },
  })

export { handler as GET, handler as POST }
