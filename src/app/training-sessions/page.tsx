import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { FilteredTrainingSessionList } from '../_components/filtered-training-sessions-list/filtered-training-sessions-list'
import GridLayout from '../_components/grid-layout/grid-layout'
import { Loader } from '../_components/loader/loader'

export default async function TrainingSessionsPage(): Promise<React.JSX.Element> {
  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <GridLayout title="Training Sessions">
      <Suspense fallback={<Loader />}>
        <FilteredTrainingSessionList trainingSessions={trainingSessions} />
      </Suspense>
    </GridLayout>
  )
}
