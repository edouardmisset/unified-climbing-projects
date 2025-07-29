import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import SuperJSON from 'superjson'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // Set longer staleTime for better caching performance
        // Data is considered fresh for 10 minutes
        staleTime: 10 * 60 * 1000,
        // Keep data in cache for 30 minutes even when not in use
        gcTime: 30 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        networkMode: 'offlineFirst',
      },
    },
  })
