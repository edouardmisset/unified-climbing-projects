import type { OrAll } from '~/app/_components/dashboard/types'
import type { Period } from '~/schema/generic'
import type { TrainingSession } from '~/schema/training'
import { useLocationQueryState } from './query-state-slices/use-location-query-state'
import { usePeriodQueryState } from './query-state-slices/use-period-query-state'
import { useSessionTypeQueryState } from './query-state-slices/use-session-type-query-state'
import { useYearQueryState } from './query-state-slices/use-year-query-state'

export const useTrainingSessionsQueryState =
  (): UseTrainingSessionsQueryStateReturn => {
    const [selectedYear, setYear] = useYearQueryState()
    const [selectedPeriod, setPeriod] = usePeriodQueryState()
    const [selectedSessionType, setSessionType] = useSessionTypeQueryState()
    const [selectedLocation, setLocation] = useLocationQueryState()

    return {
      selectedLocation,
      selectedPeriod,
      selectedSessionType,
      selectedYear,
      setLocation,
      setPeriod,
      setSessionType,
      setYear,
    }
  }

type UseTrainingSessionsQueryStateReturn = {
  selectedLocation: OrAll<NonNullable<TrainingSession['location']>>
  selectedPeriod: OrAll<Period>
  selectedSessionType: OrAll<NonNullable<TrainingSession['type']>>
  selectedYear: OrAll<string>
  setLocation: (
    location: OrAll<NonNullable<TrainingSession['location']>>,
  ) => void
  setPeriod: (period: OrAll<Period>) => void
  setSessionType: (
    sessionType: OrAll<NonNullable<TrainingSession['type']>>,
  ) => void
  setYear: (year: OrAll<string>) => void
}
