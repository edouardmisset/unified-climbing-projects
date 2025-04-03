import { Suspense } from 'react'
import { api } from '~/trpc/server'
import { FilteredTrainingSessionList } from '../_components/filtered-training-sessions-list/filtered-training-sessions-list'
import { Loader } from '../_components/loader/loader'
import styles from './page.module.css'

export default async function TrainingSessionsPage(): Promise<React.JSX.Element> {
  const trainingSessions = await api.training.getAllTrainingSessions()

  return (
    <div className={styles.container}>
      <h1 className="super-center">Training Sessions</h1>
      <Suspense fallback={<Loader />}>
        <FilteredTrainingSessionList trainingSessions={trainingSessions} />
      </Suspense>
    </div>
  )
}
