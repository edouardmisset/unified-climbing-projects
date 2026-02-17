import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import { AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { PERIOD } from '~/schema/generic'
import type { TrainingSessionListProps } from '~/schema/training.ts'
import { createChangeHandler } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import { type FilterConfig, LOCATION_TYPES } from '../types'

export function TrainingDashboardFilterBar({ trainingSessions }: TrainingSessionListProps) {
  const yearList = useMemo(
    () =>
      createYearList(trainingSessions, {
        descending: true,
        continuous: false,
      }).map(String),
    [trainingSessions],
  )

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

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          handleChange: createChangeHandler(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          handleChange: createChangeHandler(setLocationType),
          name: 'Location Type',
          options: LOCATION_TYPES,
          selectedValue: selectedLocationType,
          title: 'Indoor / Outdoor',
        },
        {
          handleChange: createChangeHandler(setDiscipline),
          name: 'Discipline',
          options: AVAILABLE_CLIMBING_DISCIPLINE,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          handleChange: createChangeHandler(setPeriod),
          name: 'Period',
          options: PERIOD,
          selectedValue: selectedPeriod,
          title: 'Period',
        },
      ] as const satisfies FilterConfig[],
    [
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
