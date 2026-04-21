import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useDeferredValue, useMemo } from 'react'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import { filterTrainingSessions } from '~/training/helpers/filter-training'
import { normalizeFilterValue } from '~/shared/helpers/normalize-filter-value'
import type { TrainingSession } from '~/training/schema'
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

  const filteredTrainingSessions = useMemo(() => {
    const selectedYearNumber = Number(deferredSelectedYear)

    return filterTrainingSessions(trainingSessions, {
      climbingDiscipline: normalizeFilterValue(deferredSelectedDiscipline),
      gymCrag: normalizeFilterValue(deferredSelectedLocation),
      load: normalizeFilterValue(deferredSelectedLoad),
      locationType: normalizeFilterValue(deferredSelectedLocationType),
      period: normalizeFilterValue(deferredSelectedPeriod),
      sessionType: normalizeFilterValue(deferredSelectedSessionType),
      year:
        deferredSelectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
    })
  }, [
    deferredSelectedDiscipline,
    deferredSelectedLoad,
    deferredSelectedLocation,
    deferredSelectedLocationType,
    deferredSelectedPeriod,
    deferredSelectedSessionType,
    deferredSelectedYear,
    trainingSessions,
  ])

  return filteredTrainingSessions
}
