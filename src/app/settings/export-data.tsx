import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'
import { ExportControls } from './export-controls'

export async function ExportData() {
  const [ascents, trainingSessions] = await Promise.all([getAllAscents(), getAllTrainingSessions()])
  return <ExportControls ascents={ascents} trainingSessions={trainingSessions} />
}
