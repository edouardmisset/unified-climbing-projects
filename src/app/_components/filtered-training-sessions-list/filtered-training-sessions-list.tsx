'use client'

import { Suspense } from 'react'
import NotFound from '~/app/not-found'
import { useTrainingSessionsFilter } from '~/hooks/use-training-sessions-filter'
import type { TrainingSessionListProps } from '~/schema/training'
import { Loader } from '../loader/loader'
import { TrainingSessionFilterBar } from '../training-session-filter-bar/training-session-filter-bar'
import { TrainingSessionList } from '../training-session-list/training-session-list'

export function FilteredTrainingSessionList({
  trainingSessions,
}: TrainingSessionListProps) {
  const filteredTrainingSessions = useTrainingSessionsFilter(
    trainingSessions ?? [],
  )

  if (trainingSessions.length === 0) return <NotFound />

  return (
    <section className="flex flex-column grid-full-width">
      <TrainingSessionFilterBar trainingSessions={trainingSessions} />
      <Suspense fallback={<Loader />}>
        <TrainingSessionList trainingSessions={filteredTrainingSessions} />
      </Suspense>
    </section>
  )
}
