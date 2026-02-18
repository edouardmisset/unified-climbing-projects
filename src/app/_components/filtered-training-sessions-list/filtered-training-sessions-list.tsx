'use client'

import { Suspense } from 'react'
import { TrainingSessionFilterBar } from '~/app/_components/filter-bar/_components/training-session-filter-bar'
import NotFound from '~/app/not-found'
import { useTrainingSessionsFilter } from '~/hooks/use-training-sessions-filter'
import type { TrainingSessionListProps } from '~/schema/training'
import { Loader } from '../loader/loader'
import { TrainingSessionList } from '../training-session-list/training-session-list'

export function FilteredTrainingSessionList({ trainingSessions }: TrainingSessionListProps) {
  const filteredTrainingSessions = useTrainingSessionsFilter(trainingSessions ?? [])

  if (trainingSessions.length === 0) return <NotFound />

  return (
    <section className='flex flexColumn gridFullWidth padding overflowXClip'>
      <TrainingSessionFilterBar trainingSessions={trainingSessions} />
      <Suspense fallback={<Loader />}>
        <TrainingSessionList trainingSessions={filteredTrainingSessions} />
      </Suspense>
    </section>
  )
}
