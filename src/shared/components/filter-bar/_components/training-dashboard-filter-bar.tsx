import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import { isIndoorSession } from '~/wrap-up/components/wrap-up/_components/training-summary/helpers'
import { createYearList } from '~/shared/data/helpers.ts'
import { filterTrainingSessions } from '~/training/helpers/filter-training'
import { normalizeFilterValue } from '~/shared/helpers/normalize-filter-value'
import { useTrainingSessionsQueryState } from '~/training/hooks/use-training-sessions-query-state.ts'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/ascents/schema'
import { PERIOD, PERIOD_TO_DATES } from '~/shared/schema'
import type { TrainingSessionListProps } from '~/training/schema.ts'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
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

  const yearList = useMemo(() => {
    const filteredForYear = filterTrainingSessions(trainingSessions, {
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      locationType: normalizeFilterValue(selectedLocationType),
      period: normalizeFilterValue(selectedPeriod),
    })
    return createYearList(filteredForYear, {
      descending: true,
      continuous: false,
    }).map(String)
  }, [trainingSessions, selectedDiscipline, selectedLocationType, selectedPeriod])

  const effectiveSelectedYear = yearList.includes(selectedYear) ? selectedYear : ALL_VALUE

  const selectedYearNumber = useMemo(() => {
    const n = Number(effectiveSelectedYear)
    return effectiveSelectedYear !== ALL_VALUE && isValidNumber(n) ? n : undefined
  }, [effectiveSelectedYear])

  const disciplineList = useMemo(() => {
    const filteredForDiscipline = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      locationType: normalizeFilterValue(selectedLocationType),
      period: normalizeFilterValue(selectedPeriod),
    })
    return AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
      filteredForDiscipline.some(session => session.climbingDiscipline === discipline),
    )
  }, [trainingSessions, selectedYearNumber, selectedLocationType, selectedPeriod])

  const effectiveSelectedDiscipline = disciplineList.includes(selectedDiscipline)
    ? selectedDiscipline
    : ALL_VALUE

  const locationTypeList = useMemo(() => {
    const filteredForLocationType = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      period: normalizeFilterValue(selectedPeriod),
    })
    const hasIndoor = filteredForLocationType.some(({ sessionType }) =>
      isIndoorSession({ sessionType }),
    )
    const hasOutdoor = filteredForLocationType.some(({ sessionType }) => sessionType === 'Out')
    return LOCATION_TYPES.filter(locationType =>
      locationType === 'Indoor' ? hasIndoor : hasOutdoor,
    )
  }, [trainingSessions, selectedYearNumber, effectiveSelectedDiscipline, selectedPeriod])

  const effectiveSelectedLocationType = locationTypeList.includes(selectedLocationType)
    ? selectedLocationType
    : ALL_VALUE

  const periodList = useMemo(() => {
    const filteredForPeriod = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      locationType: normalizeFilterValue(effectiveSelectedLocationType),
    })
    return PERIOD.filter(period =>
      filteredForPeriod.some(({ date }) =>
        isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
      ),
    )
  }, [
    trainingSessions,
    selectedYearNumber,
    effectiveSelectedDiscipline,
    effectiveSelectedLocationType,
  ])

  const effectiveSelectedPeriod = periodList.includes(selectedPeriod) ? selectedPeriod : ALL_VALUE

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
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
      ] as const satisfies FilterConfig[],
    [
      disciplineList,
      effectiveSelectedDiscipline,
      effectiveSelectedLocationType,
      effectiveSelectedPeriod,
      effectiveSelectedYear,
      locationTypeList,
      periodList,
      setDiscipline,
      setLocationType,
      setPeriod,
      setYear,
      yearList,
    ],
  )

  return <StickyFilterBar filters={filters} showSearch={false} />
}
