import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import {
  LOAD_CATEGORIES,
  SESSION_TYPES,
  type TrainingSessionListProps,
} from '~/schema/training.ts'
import { FilterBar } from '../filter-bar'
import { createChangeHandler } from '../helpers'
import type { FilterConfig } from '../types'

export function TrainingSessionFilterBar({
  trainingSessions,
}: TrainingSessionListProps) {
  const yearList = createYearList(trainingSessions, {
    descending: true,
    continuous: false,
  })

  const locationList = useMemo(
    () =>
      [
        ...new Set(
          trainingSessions
            .map(({ gymCrag }) => gymCrag?.trim())
            .filter(Boolean),
        ),
      ].sort(compareStringsAscending),
    [trainingSessions],
  )

  const {
    selectedLoad,
    selectedLocation,
    selectedSessionType,
    selectedYear,
    setLoad,
    setLocation,
    setSessionType,
    setYear,
  } = useTrainingSessionsQueryState()

  const filters = useMemo<FilterConfig[]>(
    () => [
      {
        handleChange: createChangeHandler(setSessionType),
        name: 'Session Type',
        options: SESSION_TYPES,
        selectedValue: selectedSessionType,
        title: 'Session Type',
      },
      {
        handleChange: createChangeHandler(setLoad),
        name: 'load',
        options: LOAD_CATEGORIES,
        selectedValue: selectedLoad,
        title: 'Load',
      },
      {
        handleChange: createChangeHandler(setYear),
        name: 'year',
        options: yearList,
        selectedValue: selectedYear,
        title: 'Year',
      },
      {
        handleChange: createChangeHandler(setLocation),
        name: 'location',
        options: locationList,
        selectedValue: selectedLocation,
        title: 'Location',
      },
    ],
    [
      setSessionType,
      setLoad,
      setYear,
      setLocation,
      selectedSessionType,
      selectedLoad,
      selectedYear,
      selectedLocation,
      yearList,
      locationList,
    ],
  )

  return <FilterBar filters={filters} />
}
