import { isValidNumber } from '@edouardmisset/math'
import { useDeferredValue } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import type { TrainingSession } from '~/schema/training'
import { useTrainingSessionsQueryState } from './use-training-sessions-query-state'

export function useTrainingSessionsFilter(trainingSessions: TrainingSession[]): TrainingSession[] {
  const {
    selectedYear,
    selectedSessionType,
    selectedLoad,
    selectedLocation,
    selectedPeriod,
    selectedDiscipline,
    selectedLocationType,
  } = useTrainingSessionsQueryState()

  const deferredSelectedDiscipline = useDeferredValue(selectedDiscipline)
  const deferredSelectedLoad = useDeferredValue(selectedLoad)
  const deferredSelectedLocation = useDeferredValue(selectedLocation)
  const deferredSelectedLocationType = useDeferredValue(selectedLocationType)
  const deferredSelectedPeriod = useDeferredValue(selectedPeriod)
  const deferredSelectedSessionType = useDeferredValue(selectedSessionType)
  const deferredSelectedYear = useDeferredValue(selectedYear)

  const selectedYearNumber = Number(deferredSelectedYear)
  const filteredTrainingSessions = filterTrainingSessions(trainingSessions, {
    discipline: normalizeFilterValue(deferredSelectedDiscipline),
    location: normalizeFilterValue(deferredSelectedLocation),
    load: normalizeFilterValue(deferredSelectedLoad),
    locationType: normalizeFilterValue(deferredSelectedLocationType),
    period: normalizeFilterValue(deferredSelectedPeriod),
    type: normalizeFilterValue(deferredSelectedSessionType),
    year:
      deferredSelectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
        ? selectedYearNumber
        : undefined,
  })

  return filteredTrainingSessions
}
