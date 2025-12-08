import type { OrAll } from '~/app/_components/dashboard/types'
import type { Period } from '~/schema/generic'
import type { LoadCategory, TrainingSession } from '~/schema/training'
import { useLoadQueryState } from './query-state-slices/use-load-query-state'
import { useLocationQueryState } from './query-state-slices/use-location-query-state'
import { usePeriodQueryState } from './query-state-slices/use-period-query-state'
import { useSessionTypeQueryState } from './query-state-slices/use-session-type-query-state'
import { useYearQueryState } from './query-state-slices/use-year-query-state'

export const useTrainingSessionsQueryState =
  (): UseTrainingSessionsQueryStateReturn => {
    const [selectedYear, setYear] = useYearQueryState()
    const [selectedPeriod, setPeriod] = usePeriodQueryState()
    const [selectedSessionType, setSessionType] = useSessionTypeQueryState()
    const [selectedLoad, setLoad] = useLoadQueryState()
    const [selectedLocation, setLocation] = useLocationQueryState()

    return {
      selectedLoad,
      selectedLocation,
      selectedPeriod,
      selectedSessionType,
      selectedYear,
      setLoad,
      setLocation,
      setPeriod,
      setSessionType,
      setYear,
    }
  }

type UseTrainingSessionsQueryStateReturn = {
  selectedLoad: OrAll<LoadCategory>
  selectedLocation: OrAll<NonNullable<TrainingSession['gymCrag']>>
  selectedPeriod: OrAll<Period>
  selectedSessionType: OrAll<NonNullable<TrainingSession['sessionType']>>
  selectedYear: OrAll<string>
  setLoad: (load: OrAll<LoadCategory>) => void
  setLocation: (
    location: OrAll<NonNullable<TrainingSession['gymCrag']>>,
  ) => void
  setPeriod: (period: OrAll<Period>) => void
  setSessionType: (
    sessionType: OrAll<NonNullable<TrainingSession['sessionType']>>,
  ) => void
  setYear: (year: OrAll<string>) => void
}
