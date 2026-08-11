import { isValidNumber } from '@edouardmisset/math'
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

  const selectedYearNumber = Number(selectedYear)
  const filteredTrainingSessions = filterTrainingSessions(trainingSessions, {
    discipline: normalizeFilterValue(selectedDiscipline),
    location: normalizeFilterValue(selectedLocation),
    load: normalizeFilterValue(selectedLoad),
    locationType: normalizeFilterValue(selectedLocationType),
    period: normalizeFilterValue(selectedPeriod),
    type: normalizeFilterValue(selectedSessionType),
    year:
      selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
        ? selectedYearNumber
        : undefined,
  })

  return filteredTrainingSessions
}
