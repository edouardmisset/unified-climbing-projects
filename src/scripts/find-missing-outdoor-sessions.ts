// Write a function to find missing outdoor sessions.
// To do this, first compile a list (set) of all the days with ascents based on
// the list of all ascents.
// Then, get the list of all the outdoor sessions and compute the difference

import { extractDateFromISODateString } from '~/helpers/date'
import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'

// between the two sets to find the missing days.
export async function findMissingOutdoorSessions(): Promise<string[]> {
  const ascentDays = await getAllAscents()
  const ascentDaysSet = new Set(
    ascentDays.map(({ date }) => extractDateFromISODateString(date)),
  )

  const outdoorSessions = await getAllTrainingSessions()
  const outdoorSessionsSet = new Set(
    outdoorSessions
      .filter(({ sessionType }) => sessionType === 'Out')
      .map(({ date }) => extractDateFromISODateString(date)),
  )

  const missingDays = [...ascentDaysSet].filter(
    date => !outdoorSessionsSet.has(date),
  )
  return missingDays
}

globalThis.console.log(
  `Missing outdoor sessions on the following days: ${(await findMissingOutdoorSessions()).join(', ')}`,
)
