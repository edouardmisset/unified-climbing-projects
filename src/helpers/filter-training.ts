// oxlint-disable complexity
import { isDateInRange } from '@edouardmisset/date'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { LocationType } from '~/app/_components/filter-bar/types'
import { isIndoorSession } from '~/app/_components/wrap-up/_components/training-summary/helpers'
import { calculateLoad } from '~/helpers/calculate-load'
import { PERIOD_TO_DATES, type Period } from '~/schema/generic'
import type { LoadCategory, TrainingSession } from '~/schema/training.ts'

type OptionalTrainingInput = Partial<Omit<TrainingSession, 'date' | 'comments'>> & {
  year?: number
  load?: LoadCategory
  period?: Period
  locationType?: LocationType
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
    discipline,
    energySystem,
    location,
    intensity,
    load,
    type,
    volume,
    year,
    period,
    locationType,
  } = filters ?? {}

  if (!trainingSessions || trainingSessions.length === 0) return []

  return trainingSessions.filter((trainingSession) => {
    const trainingSessionDate = new Date(trainingSession.date)

    return (
      (location === undefined ||
        stringEqualsCaseInsensitive(trainingSession?.location ?? '', location)) &&
      (discipline === undefined || trainingSession.discipline === discipline) &&
      (year === undefined || isDateInYear(trainingSessionDate, year)) &&
      (anatomicalRegion === undefined || trainingSession.anatomicalRegion === anatomicalRegion) &&
      (energySystem === undefined || trainingSession.energySystem === energySystem) &&
      (intensity === undefined || trainingSession.intensity === intensity) &&
      (load === undefined ||
        isLoadInLoadCategory(
          calculateLoad(trainingSession.volume, trainingSession.intensity),
          load,
        )) &&
      (type === undefined || trainingSession.type === type) &&
      (volume === undefined || trainingSession.volume === volume) &&
      (period === undefined ||
        isDateInRange(trainingSessionDate, { ...PERIOD_TO_DATES[period] })) &&
      (locationType === undefined ||
        (locationType === 'Indoor'
          ? isIndoorSession({ type: trainingSession.type })
          : trainingSession.type === 'Outdoor'))
    )
  })
}

function isLoadInLoadCategory(load: number | undefined, loadCategory: LoadCategory): boolean {
  const lowCategoryUpperBound = 30
  const highCategoryLowerBound = 70
  if (load === undefined) return false

  if (loadCategory === 'Low') return load < lowCategoryUpperBound

  if (loadCategory === 'Medium')
    return lowCategoryUpperBound <= load && load < highCategoryLowerBound

  if (loadCategory === 'High') return highCategoryLowerBound <= load

  return false
}
