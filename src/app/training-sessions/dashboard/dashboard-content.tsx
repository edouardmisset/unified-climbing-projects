import { TrainingDashboard } from '~/app/_components/training-dashboard/training-dashboard'
import { getAllTrainingSessions } from '~/services/training'

export async function DashboardContent() {
  const trainingSessions = await getAllTrainingSessions()
  return <TrainingDashboard trainingSessions={trainingSessions} />
}
