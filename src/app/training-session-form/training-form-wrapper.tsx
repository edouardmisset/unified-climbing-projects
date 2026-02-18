import TrainingSessionForm from './_components/training-session-form.tsx'
import { getAllTrainingLocations } from '~/services/training'

export async function TrainingFormWrapper() {
  const allLocations = await getAllTrainingLocations()
  return <TrainingSessionForm allLocations={allLocations} />
}
