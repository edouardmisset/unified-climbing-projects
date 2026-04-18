import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { createYearList } from '~/data/helpers.ts'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { PERIOD } from '~/schema/generic'
import type { TrainingSessionListProps } from '~/schema/training.ts'
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

  const disciplineList = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)
    const filteredForDiscipline = filterTrainingSessions(trainingSessions, {
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
      locationType: normalizeFilterValue(selectedLocationType),
      period: normalizeFilterValue(selectedPeriod),
    })
    return AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
      filteredForDiscipline.some(session => session.climbingDiscipline === discipline),
    )
  }, [trainingSessions, selectedYear, selectedLocationType, selectedPeriod])

  const locationTypeList = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)
    const filteredForLocationType = filterTrainingSessions(trainingSessions, {
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      period: normalizeFilterValue(selectedPeriod),
    })
    return LOCATION_TYPES.filter(
      locationType =>
        filterTrainingSessions(filteredForLocationType, { locationType }).length > 0,
    )
  }, [trainingSessions, selectedYear, selectedDiscipline, selectedPeriod])

  const periodList = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)
    const filteredForPeriod = filterTrainingSessions(trainingSessions, {
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      locationType: normalizeFilterValue(selectedLocationType),
    })
    return PERIOD.filter(period => filterTrainingSessions(filteredForPeriod, { period }).length > 0)
  }, [trainingSessions, selectedYear, selectedDiscipline, selectedLocationType])

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          setValue: createValueSetter(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          setValue: createValueSetter(setLocationType),
          name: 'Location Type',
          options: locationTypeList,
          selectedValue: selectedLocationType,
          title: 'Indoor / Outdoor',
        },
        {
          setValue: createValueSetter(setDiscipline),
          name: 'Discipline',
          options: disciplineList,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          setValue: createValueSetter(setPeriod),
          name: 'Period',
          options: periodList,
          selectedValue: selectedPeriod,
          title: 'Period',
        },
      ] as const satisfies FilterConfig[],
    [
      disciplineList,
      locationTypeList,
      periodList,
      selectedDiscipline,
      selectedLocationType,
      selectedPeriod,
      selectedYear,
      setDiscipline,
      setLocationType,
      setPeriod,
      setYear,
      yearList,
    ],
  )

  return <StickyFilterBar filters={filters} showSearch={false} />
}
