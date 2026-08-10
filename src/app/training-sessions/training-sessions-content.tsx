import { FilteredTrainingSessionList } from '~/app/_components/filtered-training-sessions-list/filtered-training-sessions-list'
import { getAllTrainingSessions } from '~/services/training'

export async function TrainingSessionList() {
  const trainingSessions = await getAllTrainingSessions()
  return <FilteredTrainingSessionList trainingSessions={trainingSessions} />
}
