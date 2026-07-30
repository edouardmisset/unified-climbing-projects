import LogWizard from './_components/log-wizard'
import { getAllAreas, getAllCrags, getLatestAscent } from '~/services/ascent-helpers'
import { getAllTrainingLocations } from '~/services/training'

export async function LogFormWrapper() {
  const [latestAscent, crags, areas, trainingLocations] = await Promise.all([
    getLatestAscent(),
    getAllCrags(),
    getAllAreas(),
    getAllTrainingLocations(),
  ])
  const locations = [...new Set([...crags, ...trainingLocations])]

  return <LogWizard areas={areas} latestAscent={latestAscent} locations={locations} />
}
