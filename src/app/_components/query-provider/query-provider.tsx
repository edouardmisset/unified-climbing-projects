'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useReducer } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useReducer(
    (currentQueryClient: QueryClient) => currentQueryClient,
    undefined,
    () => new QueryClient(),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
