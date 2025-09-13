import type { OrAll } from '~/app/_components/dashboard/types'
import type { Ascent } from '~/schema/ascent'
import type { Period } from '~/schema/generic'
import { useCragQueryState } from './query-state-slices/use-crag-query-state'
import { useDisciplineQueryState } from './query-state-slices/use-discipline-query-state'
import { useGradeQueryState } from './query-state-slices/use-grade-query-state'
import { usePeriodQueryState } from './query-state-slices/use-period-query-state'
import { useRouteQueryState } from './query-state-slices/use-route-query-state'
import { useStyleQueryState } from './query-state-slices/use-style-query-state'
import { useYearQueryState } from './query-state-slices/use-year-query-state'

export const useAscentsQueryState = (): UseAscentsQueryStateReturn => {
  const [selectedYear, setYear] = useYearQueryState()
  const [selectedPeriod, setPeriod] = usePeriodQueryState()
  const [selectedDiscipline, setDiscipline] = useDisciplineQueryState()
  const [selectedStyle, setStyle] = useStyleQueryState()
  const [selectedCrag, setCrag] = useCragQueryState()
  const [selectedGrade, setGrade] = useGradeQueryState()
  const [selectedRoute, setRoute] = useRouteQueryState()

  return {
    selectedCrag,
    selectedDiscipline,
    selectedGrade,
    selectedPeriod,
    selectedRoute,
    selectedStyle,
    selectedYear,
    setCrag,
    setDiscipline,
    setGrade,
    setPeriod,
    setRoute,
    setStyle,
    setYear,
  }
}

type UseAscentsQueryStateReturn = {
  selectedCrag: OrAll<Ascent['crag']>
  selectedDiscipline: OrAll<Ascent['climbingDiscipline']>
  selectedGrade: OrAll<Ascent['topoGrade']>
  selectedPeriod: OrAll<Period>
  selectedRoute: Ascent['routeName']
  selectedStyle: OrAll<Ascent['style']>
  selectedYear: OrAll<string>
  setCrag: (crag: OrAll<Ascent['crag']>) => void
  setDiscipline: (discipline: OrAll<Ascent['climbingDiscipline']>) => void
  setGrade: (grade: OrAll<Ascent['topoGrade']>) => void
  setPeriod: (period: OrAll<Period>) => void
  setRoute: (route: Ascent['routeName']) => void
  setStyle: (style: OrAll<Ascent['style']>) => void
  setYear: (year: OrAll<string>) => void
}
