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
  const { selectedYear, selectedSessionType, selectedLoad, selectedLocation } =
    useTrainingSessionsQueryState()

  const filteredTrainingSessions = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)
    return filterTrainingSessions(trainingSessions, {
      gymCrag: normalizeFilterValue(selectedLocation),
      load: normalizeFilterValue(selectedLoad),
      sessionType: normalizeFilterValue(selectedSessionType),
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
    })
  }, [
    trainingSessions,
    selectedLocation,
    selectedLoad,
    selectedSessionType,
    selectedYear,
  ])

  return filteredTrainingSessions
}
