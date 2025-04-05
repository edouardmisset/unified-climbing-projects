import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
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
        year:
          selectedYear !== ALL_VALUE && isValidNumber(selectedYear)
            ? Number(selectedYear)
            : undefined,
        sessionType:
          selectedSessionType === ALL_VALUE ? undefined : selectedSessionType,
        load: selectedLoad === ALL_VALUE ? undefined : selectedLoad,
        gymCrag: selectedLocation === ALL_VALUE ? undefined : selectedLocation,
      }),
    [
      trainingSessions,
      selectedLocation,
      selectedLoad,
      selectedSessionType,
      selectedYear,
    ],
  )

  return filteredTrainingSessions
}
