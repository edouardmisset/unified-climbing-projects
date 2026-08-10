import { sortByDate } from '@edouardmisset/date'
import LogWizard from './_components/log-wizard'

import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'

export async function LogFormWrapper() {
  const [ascents, trainingSessions] = await Promise.all([getAllAscents(), getAllTrainingSessions()])
  const ascentsByRecency = ascents.toSorted((a, b) => sortByDate(a, b, { descending: true }))
  const latestAscent = ascentsByRecency.at(0)
  const crags = [...new Set(ascentsByRecency.map(({ crag }) => crag.trim()).filter(Boolean))]
  const areas = [...new Set(ascentsByRecency.map(({ area }) => area?.trim()).filter(Boolean))]
  const trainingLocations = trainingSessions
    .map(({ location }) => location?.trim())
    .filter((location): location is string => Boolean(location))
  const locations = [...new Set([...crags, ...trainingLocations])]

  return <LogWizard areas={areas} latestAscent={latestAscent} locations={locations} />
}
