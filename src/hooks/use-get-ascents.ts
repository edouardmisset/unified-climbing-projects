import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { api } from '~/trpc/react'

export const useGetAscents = (params?: OptionalAscentFilter) => {
  return api.ascents.getAll.useQuery(params)
}
