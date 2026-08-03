import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math'

import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { isIndoorSession } from '~/app/_components/wrap-up/_components/training-summary/helpers'
import { createYearList } from '~/data/helpers.ts'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { PERIOD, PERIOD_TO_DATES } from '~/schema/generic'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import { type FilterConfig, LOCATION_TYPES } from '../types'

// Each branch derives one dependent option list; extraction would separate the dependency chain.
// fallow-ignore-next-line complexity
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

  const filteredForYear = filterTrainingSessions(trainingSessions, {
    discipline: normalizeFilterValue(selectedDiscipline),
    locationType: normalizeFilterValue(selectedLocationType),
    period: normalizeFilterValue(selectedPeriod),
  })
  const yearList = createYearList(filteredForYear, { descending: true, continuous: false }).map(
    String,
  )

  const effectiveSelectedYear = yearList.includes(selectedYear) ? selectedYear : ALL_VALUE

  const parsedSelectedYear = Number(effectiveSelectedYear)
  const selectedYearNumber =
    effectiveSelectedYear !== ALL_VALUE && isValidNumber(parsedSelectedYear)
      ? parsedSelectedYear
      : undefined

  const filteredForDiscipline = filterTrainingSessions(trainingSessions, {
    year: selectedYearNumber,
    locationType: normalizeFilterValue(selectedLocationType),
    period: normalizeFilterValue(selectedPeriod),
  })
  const disciplineList = AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
    filteredForDiscipline.some(session => session.discipline === discipline),
  )

  const effectiveSelectedDiscipline = disciplineList.includes(selectedDiscipline)
    ? selectedDiscipline
    : ALL_VALUE

  const filteredForLocationType = filterTrainingSessions(trainingSessions, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    period: normalizeFilterValue(selectedPeriod),
  })
  const hasIndoor = filteredForLocationType.some(({ type }) => isIndoorSession({ type }))
  const hasOutdoor = filteredForLocationType.some(({ type }) => type === 'Outdoor')
  const locationTypeList = LOCATION_TYPES.filter(locationType =>
    locationType === 'Indoor' ? hasIndoor : hasOutdoor,
  )

  const effectiveSelectedLocationType = locationTypeList.includes(selectedLocationType)
    ? selectedLocationType
    : ALL_VALUE

  const filteredForPeriod = filterTrainingSessions(trainingSessions, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    locationType: normalizeFilterValue(effectiveSelectedLocationType),
  })
  const periodList = PERIOD.filter(period =>
    filteredForPeriod.some(({ date }) =>
      isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
    ),
  )

  const effectiveSelectedPeriod = periodList.includes(selectedPeriod) ? selectedPeriod : ALL_VALUE

  const filters = [
    {
      setValue: createValueSetter(setYear),
      name: 'Year',
      options: yearList,
      selectedValue: effectiveSelectedYear,
      title: 'Year',
    },
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
    {
      setValue: createValueSetter(setPeriod),
      name: 'Period',
      options: periodList,
      selectedValue: effectiveSelectedPeriod,
      title: 'Period',
    },
  ] as const satisfies FilterConfig[]

  return <StickyFilterBar filters={filters} showSearch={false} />
}
