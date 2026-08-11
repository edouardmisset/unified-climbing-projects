'use client'

import { useQuery } from '@tanstack/react-query'
import { getAscentDetails } from '~/app/ascents/actions'
import { Loader } from '../ui/loader/loader'
import { AscentCard } from './ascent-card'

export function AscentCardLoader({ enabled, id }: { enabled: boolean; id: string }) {
  const ascentQuery = useQuery({
    enabled,
    queryFn: () => getAscentDetails(id),
    queryKey: ['ascent-details', id],
    staleTime: 60_000,
  })

  if (ascentQuery.isPending) return <Loader />
  if (ascentQuery.isError) return <p role='alert'>Unable to load ascent</p>
  if (ascentQuery.data === false) return <p>Ascent not found</p>

  return <AscentCard ascent={ascentQuery.data} />
}
