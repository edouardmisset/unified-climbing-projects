'use client'

import NotFound from '~/app/not-found'
import { useTrainingSessionsFilter } from '~/hooks/use-training-sessions-filter'
import type { TrainingSession } from '~/schema/training'
import { TrainingSessionFilterBar } from '../training-session-filter-bar/training-session-filter-bar'
import { TrainingSessionList } from '../training-session-list/training-session-list'

export function FilteredTrainingSessionList({
  trainingSessions,
}: {
  trainingSessions: TrainingSession[]
}) {
  const filteredTrainingSessions = useTrainingSessionsFilter(
    trainingSessions ?? [],
  )

  if (!trainingSessions) return <NotFound />

  return (
    <section className="flex flex-column gap grid-full-width">
      <TrainingSessionFilterBar trainingSessions={trainingSessions} />
      <TrainingSessionList trainingSessions={filteredTrainingSessions} />
    </section>
  )
}
