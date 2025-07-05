import { useQuery } from '@tanstack/react-query'
import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { useTRPC } from '~/trpc/react'

export const useGetAscents = (params?: OptionalAscentFilter) => {
  const api = useTRPC()
  return useQuery(api.ascents.getAll.queryOptions(params))
}
