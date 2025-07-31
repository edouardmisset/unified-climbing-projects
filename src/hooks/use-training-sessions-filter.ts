import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useDeferredValue, useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterTrainingSessions } from '~/helpers/filter-training'
import type { TrainingSession } from '~/schema/training'
import { useTrainingSessionsQueryState } from './use-training-sessions-query-state'

export function useTrainingSessionsFilter(
  trainingSessions: TrainingSession[],
): TrainingSession[] {
  const { selectedYear, selectedSessionType, selectedLoad, selectedLocation } =
    useTrainingSessionsQueryState()

  const filteredTrainingSessions = useMemo(
    () =>
      filterTrainingSessions(trainingSessions, {
        gymCrag: selectedLocation === ALL_VALUE ? undefined : selectedLocation,
        load: selectedLoad === ALL_VALUE ? undefined : selectedLoad,
        sessionType:
          selectedSessionType === ALL_VALUE ? undefined : selectedSessionType,
        year:
          selectedYear !== ALL_VALUE && isValidNumber(Number(selectedYear))
            ? Number(selectedYear)
            : undefined,
      }),
    [
      trainingSessions,
      selectedLocation,
      selectedLoad,
      selectedSessionType,
      selectedYear,
    ],
  )

  const deferredTrainingSessions = useDeferredValue(filteredTrainingSessions)

  return deferredTrainingSessions
}
