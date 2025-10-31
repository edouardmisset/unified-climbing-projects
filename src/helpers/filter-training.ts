import { isDateInRange } from '@edouardmisset/date'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import { PERIOD_TO_DATES, type Period } from '~/schema/generic'
import type { TrainingSession } from '~/schema/training.ts'

type OptionalTrainingInput = Partial<
  Omit<TrainingSession, 'date' | 'comments'>
> & {
  year?: number
  period?: Period
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
    discipline: climbingDiscipline,
    energySystem,
    location,
    intensity,
    type,
    volume,
    year,
    period,
  } = filters ?? {}

  if (!trainingSessions || trainingSessions.length === 0) {
    globalThis.console.log(
      'No training sessions passed to filterTrainingSessions',
    )
    return []
  }

  return trainingSessions.filter(trainingSession => {
    const trainingSessionDate = new Date(trainingSession.date)
    return (
      (location === undefined ||
        stringEqualsCaseInsensitive(
          trainingSession?.location ?? '',
          location,
        )) &&
      (climbingDiscipline === undefined ||
        trainingSession.discipline === climbingDiscipline) &&
      (year === undefined || isDateInYear(trainingSessionDate, year)) &&
      (anatomicalRegion === undefined ||
        trainingSession.anatomicalRegion === anatomicalRegion) &&
      (energySystem === undefined ||
        trainingSession.energySystem === energySystem) &&
      (intensity === undefined || trainingSession.intensity === intensity) &&
      (type === undefined || trainingSession.type === type) &&
      (volume === undefined || trainingSession.volume === volume) &&
      (period === undefined ||
        isDateInRange(trainingSessionDate, { ...PERIOD_TO_DATES[period] }))
    )
  })
}
