import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import type { LoadCategory, TrainingSession } from '~/schema/training.ts'
import { isDateInYear } from './is-date-in-year.ts'

type OptionalTrainingInput = Partial<
  Omit<TrainingSession, 'date' | 'comments' | 'load'>
> & {
  year?: number
  load?: LoadCategory
}

/**
 * Filters an array of training sessions based on the provided criteria.
 *
 * @param {TrainingSession[]} trainingSessions - The array of training sessions
 * to filter.
 * @param {OptionalTrainingInput} [filters] - An optional object containing
 * filtering criteria.
 * @returns {TrainingSession[]} The filtered array of training sessions.
 */
export function filterTrainingSessions(
  trainingSessions: TrainingSession[],
  filters?: OptionalTrainingInput,
): TrainingSession[] {
  const {
    anatomicalRegion,
    climbingDiscipline,
    energySystem,
    gymCrag,
    intensity,
    load,
    sessionType,
    volume,
    year,
  } = filters ?? {}

  if (!trainingSessions || trainingSessions.length === 0) {
    globalThis.console.log(
      'No training sessions passed to filterTrainingSessions',
    )
    return []
  }

  return trainingSessions.filter(
    trainingSession =>
      (gymCrag === undefined ||
        stringEqualsCaseInsensitive(trainingSession?.gymCrag ?? '', gymCrag)) &&
      (climbingDiscipline === undefined ||
        trainingSession.climbingDiscipline === climbingDiscipline) &&
      (year === undefined || isDateInYear(trainingSession.date, year)) &&
      (anatomicalRegion === undefined ||
        trainingSession.anatomicalRegion === anatomicalRegion) &&
      (energySystem === undefined ||
        trainingSession.energySystem === energySystem) &&
      (intensity === undefined || trainingSession.intensity === intensity) &&
      (load === undefined ||
        isLoadInLoadCategory(trainingSession.load, load)) &&
      (sessionType === undefined ||
        trainingSession.sessionType === sessionType) &&
      (volume === undefined || trainingSession.volume === volume),
  )
}

function isLoadInLoadCategory(
  load: TrainingSession['load'],
  loadCategory: LoadCategory,
): boolean {
  if (load === undefined) return false

  if (loadCategory === 'Low') {
    return load < 30
  }
  if (loadCategory === 'Medium') {
    return 30 <= load && load < 70
  }
  if (loadCategory === 'High') {
    return load >= 70
  }
  return false
}
