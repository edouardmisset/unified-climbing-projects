import { isDateInRange } from '@edouardmisset/date'
import type { LocationType } from '~/app/_components/filter-bar/types'
import { isIndoorSession } from '~/app/_components/wrap-up/_components/training-summary/helpers'
import { calculateLoad } from '~/helpers/calculate-load'
import { matchesText, matchesValue, matchesYear } from '~/helpers/filter-matchers'
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

  if (trainingSessions.length === 0) return []

  return trainingSessions.filter(trainingSession => {
    const trainingSessionDate = new Date(trainingSession.date)

    return (
      matchesText(trainingSession.location ?? '', location) &&
      matchesValue(trainingSession.discipline, discipline) &&
      matchesYear(trainingSessionDate, year) &&
      matchesValue(trainingSession.anatomicalRegion, anatomicalRegion) &&
      matchesValue(trainingSession.energySystem, energySystem) &&
      matchesValue(trainingSession.intensity, intensity) &&
      matchesLoad(trainingSession, load) &&
      matchesValue(trainingSession.type, type) &&
      matchesValue(trainingSession.volume, volume) &&
      matchesPeriod(trainingSessionDate, period) &&
      matchesLocationType(trainingSession, locationType)
    )
  })
}

function matchesPeriod(date: Date, period: Period | undefined): boolean {
  return period === undefined || isDateInRange(date, { ...PERIOD_TO_DATES[period] })
}

function matchesLoad(session: TrainingSession, load: LoadCategory | undefined): boolean {
  return (
    load === undefined ||
    isLoadInLoadCategory(calculateLoad(session.volume, session.intensity), load)
  )
}

function matchesLocationType(
  session: TrainingSession,
  locationType: LocationType | undefined,
): boolean {
  if (locationType === undefined) return true
  return locationType === 'Indoor'
    ? isIndoorSession({ type: session.type })
    : session.type === 'Outdoor'
}

function isLoadInLoadCategory(load: number | undefined, loadCategory: LoadCategory): boolean {
  const lowCategoryUpperBound = 30
  const highCategoryLowerBound = 70
  if (load === undefined) return false

  if (loadCategory === 'Low') return load < lowCategoryUpperBound

  if (loadCategory === 'Medium')
    return lowCategoryUpperBound <= load && load < highCategoryLowerBound

  return highCategoryLowerBound <= load
}
