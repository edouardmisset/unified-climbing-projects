import { isIndoorSession } from '~/app/_components/wrap-up/_components/training-summary/helpers'
import { createYearList } from '~/data/helpers.ts'
import { ASCENT_DISCIPLINES } from '~/domain/ascent'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { getEffectiveFilterValue } from '~/helpers/get-effective-filter-value'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { resolveDateSelection } from '~/helpers/period'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import { createDateFilter } from '../date-filter'
import { type FilterConfig, LOCATION_TYPES } from '../types'

export function TrainingDashboardFilterBar({ trainingSessions }: TrainingSessionListProps) {
  const {
    selectedYear,
    selectedPeriod,
    selectedDiscipline,
    selectedLocationType,
    setYear,
    setPeriod,
    setDiscipline,
    setLocationType,
  } = useTrainingSessionsQueryState()

  const filteredExcludingDate = filterTrainingSessions(trainingSessions, {
    discipline: normalizeFilterValue(selectedDiscipline),
    locationType: normalizeFilterValue(selectedLocationType),
  })
  const yearList = createYearList(filteredExcludingDate, {
    descending: true,
    continuous: false,
  }).map(String)

  const effectiveSelectedYear = getEffectiveFilterValue(yearList, selectedYear)
  const { period: selectedDatePeriod, year: selectedYearNumber } = resolveDateSelection(
    effectiveSelectedYear,
    selectedPeriod,
  )

  const filteredForDiscipline = filterTrainingSessions(trainingSessions, {
    year: selectedYearNumber,
    locationType: normalizeFilterValue(selectedLocationType),
    period: selectedDatePeriod,
  })
  const disciplineList = ASCENT_DISCIPLINES.filter(discipline =>
    filteredForDiscipline.some(session => session.discipline === discipline),
  )

  const effectiveSelectedDiscipline = getEffectiveFilterValue(disciplineList, selectedDiscipline)

  const filteredForLocationType = filterTrainingSessions(trainingSessions, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    period: selectedDatePeriod,
  })
  const hasIndoor = filteredForLocationType.some(({ type }) => isIndoorSession({ type }))
  const hasOutdoor = filteredForLocationType.some(({ type }) => type === 'Outdoor')
  const locationTypeList = LOCATION_TYPES.filter(locationType =>
    locationType === 'Indoor' ? hasIndoor : hasOutdoor,
  )

  const effectiveSelectedLocationType = getEffectiveFilterValue(
    locationTypeList,
    selectedLocationType,
  )

  const filters = [
    createDateFilter({
      years: yearList,
      selectedYear: effectiveSelectedYear,
      selectedPeriod,
      setYear: createValueSetter(setYear),
      setPeriod: createValueSetter(setPeriod),
    }),
    {
      setValue: createValueSetter(setLocationType),
      name: 'Location Type',
      options: locationTypeList,
      selectedValue: effectiveSelectedLocationType,
      title: 'Indoor / Outdoor',
    },
    {
      setValue: createValueSetter(setDiscipline),
      name: 'Discipline',
      options: disciplineList,
      selectedValue: effectiveSelectedDiscipline,
      title: 'Climbing Discipline',
    },
  ] as const satisfies FilterConfig[]

  return <StickyFilterBar filters={filters} showSearch={false} />
}
