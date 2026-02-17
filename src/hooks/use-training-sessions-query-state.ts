import type { OrAll } from '~/app/_components/dashboard/types'
import type { LocationType } from '~/app/_components/filter-bar/types'
import type { Period } from '~/schema/generic'
import type { LoadCategory, TrainingSession } from '~/schema/training'
import { useDisciplineQueryState } from './query-state-slices/use-discipline-query-state'
import { useLoadQueryState } from './query-state-slices/use-load-query-state'
import { useLocationQueryState } from './query-state-slices/use-location-query-state'
import { useLocationTypeQueryState } from './query-state-slices/use-location-type-query-state'
import { usePeriodQueryState } from './query-state-slices/use-period-query-state'
import { useSessionTypeQueryState } from './query-state-slices/use-session-type-query-state'
import { useYearQueryState } from './query-state-slices/use-year-query-state'

export const useTrainingSessionsQueryState = (): UseTrainingSessionsQueryStateReturn => {
  const [selectedYear, setYear] = useYearQueryState()
  const [selectedPeriod, setPeriod] = usePeriodQueryState()
  const [selectedSessionType, setSessionType] = useSessionTypeQueryState()
  const [selectedLoad, setLoad] = useLoadQueryState()
  const [selectedLocation, setLocation] = useLocationQueryState()
  const [selectedDiscipline, setDiscipline] = useDisciplineQueryState()
  const [selectedLocationType, setLocationType] = useLocationTypeQueryState()

  return {
    selectedLoad,
    selectedLocation,
    selectedPeriod,
    selectedSessionType,
    selectedYear,
    selectedDiscipline,
    selectedLocationType,
    setLoad,
    setLocation,
    setPeriod,
    setSessionType,
    setYear,
    setDiscipline,
    setLocationType,
  }
}

type UseTrainingSessionsQueryStateReturn = {
  selectedLoad: OrAll<LoadCategory>
  selectedLocation: OrAll<NonNullable<TrainingSession['gymCrag']>>
  selectedPeriod: OrAll<Period>
  selectedSessionType: OrAll<NonNullable<TrainingSession['sessionType']>>
  selectedYear: OrAll<string>
  selectedDiscipline: OrAll<NonNullable<TrainingSession['climbingDiscipline']>>
  selectedLocationType: OrAll<LocationType>
  setLoad: (load: OrAll<LoadCategory>) => void
  setLocation: (location: OrAll<NonNullable<TrainingSession['gymCrag']>>) => void
  setPeriod: (period: OrAll<Period>) => void
  setSessionType: (sessionType: OrAll<NonNullable<TrainingSession['sessionType']>>) => void
  setYear: (year: OrAll<string>) => void
  setDiscipline: (discipline: OrAll<NonNullable<TrainingSession['climbingDiscipline']>>) => void
  setLocationType: (locationType: OrAll<LocationType>) => void
}
