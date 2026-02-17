import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import { PERIOD } from '~/schema/generic'
import { LOAD_CATEGORIES, SESSION_TYPES, type TrainingSessionListProps } from '~/schema/training.ts'
import { createChangeHandler } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import type { FilterConfig } from '../types'

export function TrainingSessionFilterBar({ trainingSessions }: TrainingSessionListProps) {
  const yearList = createYearList(trainingSessions, {
    descending: true,
    continuous: false,
  }).map(String)

  const locationList = useMemo(
    () =>
      [...new Set(trainingSessions.map(({ gymCrag }) => gymCrag?.trim()).filter(Boolean))].sort(
        compareStringsAscending,
      ),
    [trainingSessions],
  )

  const {
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
  } = useTrainingSessionsQueryState()

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          handleChange: createChangeHandler(setSessionType),
          name: 'Session Type',
          options: SESSION_TYPES,
          selectedValue: selectedSessionType,
          title: 'Session Type',
        },
        {
          handleChange: createChangeHandler(setLoad),
          name: 'Load',
          options: LOAD_CATEGORIES,
          selectedValue: selectedLoad,
          title: 'Load',
        },
        {
          handleChange: createChangeHandler(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          handleChange: createChangeHandler(setLocation),
          name: 'Location',
          options: locationList,
          selectedValue: selectedLocation,
          title: 'Location',
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
      locationList,
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
      yearList,
    ],
  )

  return <StickyFilterBar filters={filters} showSearch={false} />
}
