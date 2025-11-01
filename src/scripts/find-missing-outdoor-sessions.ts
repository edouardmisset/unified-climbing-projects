import { extractDateFromISODateString } from '~/helpers/date'
import { OUTDOOR } from '~/schema/training'
import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'

// Write a function to find missing outdoor sessions.
// To do this, first compile a list (set) of all the days with ascents based on
// the list of all ascents.
// Then, get the list of all the outdoor sessions and compute the difference
// between the two sets to find the missing days.
export async function findMissingOutdoorSessions(): Promise<string[]> {
  const ascentDays = await getAllAscents()
  const outdoorSessions = await getAllTrainingSessions()

  const firstRecordedTrainingSession = outdoorSessions.toSorted(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )[0]

  const filteredAscentDays = ascentDays.filter(({ date }) => {
    return (
      new Date(date).getTime() >=
      new Date(firstRecordedTrainingSession?.date ?? '').getTime()
    )
  })

  const ascentDaysSet = new Set(
    filteredAscentDays.map(({ date }) => extractDateFromISODateString(date)),
  )

  const outdoorSessionsSet = new Set(
    outdoorSessions
      .filter(({ type }) => type === OUTDOOR)
      .map(({ date }) => extractDateFromISODateString(date)),
  )

  const missingDays = [...ascentDaysSet].filter(
    date => !outdoorSessionsSet.has(date),
  )
  return missingDays
}

findMissingOutdoorSessions()
  .then(missingDays => {
    globalThis.console.log(
      `Missing outdoor sessions on the following days: ${missingDays.join(', ')}`,
    )
  })
  .catch(error => {
    globalThis.console.error('Error:', error)
  })
