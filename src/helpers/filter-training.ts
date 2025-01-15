import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import type { TrainingSession } from '~/schema/training.ts'
import { isDateInYear } from './is-date-in-year.ts'

type OptionalTrainingInput = Partial<
  Omit<TrainingSession, 'date' | 'comments'>
> & {
  year?: number
}

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
      (load === undefined || trainingSession.load === load) &&
      (sessionType === undefined ||
        trainingSession.sessionType === sessionType) &&
      (volume === undefined || trainingSession.volume === volume),
  )
}
