import { filterTrainingSessions } from '~/helpers/filter-training'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { resolveDateSelection } from '~/helpers/period'
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

  const { period, year } = resolveDateSelection(selectedYear, selectedPeriod)
  const filteredTrainingSessions = filterTrainingSessions(trainingSessions, {
    discipline: normalizeFilterValue(selectedDiscipline),
    location: normalizeFilterValue(selectedLocation),
    load: normalizeFilterValue(selectedLoad),
    locationType: normalizeFilterValue(selectedLocationType),
    period,
    type: normalizeFilterValue(selectedSessionType),
    year,
  })

  return filteredTrainingSessions
}
