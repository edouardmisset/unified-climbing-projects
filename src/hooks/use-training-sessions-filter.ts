import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import type { TrainingSession } from '~/schema/training'
import { useTrainingSessionsQueryState } from './use-training-sessions-query-state'

export function useTrainingSessionsFilter(
  trainingSessions: TrainingSession[],
): TrainingSession[] {
  const {
    selectedYear,
    selectedSessionType,
    selectedLoad,
    selectedLocation,
    selectedPeriod,
    selectedDiscipline,
    selectedLocationType,
  } = useTrainingSessionsQueryState()

  const filteredTrainingSessions = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)

    return filterTrainingSessions(trainingSessions, {
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      gymCrag: normalizeFilterValue(selectedLocation),
      load: normalizeFilterValue(selectedLoad),
      locationType: normalizeFilterValue(selectedLocationType),
      period: normalizeFilterValue(selectedPeriod),
      sessionType: normalizeFilterValue(selectedSessionType),
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
    })
  }, [
    selectedDiscipline,
    selectedLoad,
    selectedLocation,
    selectedLocationType,
    selectedPeriod,
    selectedSessionType,
    selectedYear,
    trainingSessions,
  ])

  return filteredTrainingSessions
}
