import { createYearList } from '~/data/helpers.ts'
import { TRAINING_SESSION_TYPES } from '~/domain/training-session'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useTrainingSessionsQueryState } from '~/hooks/use-training-sessions-query-state.ts'
import { LOAD_CATEGORIES, type TrainingSessionListProps } from '~/schema/training.ts'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import { createDateFilter } from '../date-filter'
import type { FilterConfig } from '../types'

export function TrainingSessionFilterBar({ trainingSessions }: TrainingSessionListProps) {
  const yearList = createYearList(trainingSessions, {
    descending: true,
    continuous: false,
  }).map(String)

  const locationList = [
    ...new Set(trainingSessions.map(({ location }) => location?.trim()).filter(Boolean)),
  ].toSorted(compareStringsAscending)

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

  const filters = [
    {
      setValue: createValueSetter(setSessionType),
      name: 'Session Type',
      options: TRAINING_SESSION_TYPES,
      selectedValue: selectedSessionType,
      title: 'Session Type',
    },
    {
      setValue: createValueSetter(setLoad),
      name: 'Load',
      options: LOAD_CATEGORIES,
      selectedValue: selectedLoad,
      title: 'Load',
    },
    createDateFilter({
      years: yearList,
      selectedYear,
      selectedPeriod,
      setYear: createValueSetter(setYear),
      setPeriod: createValueSetter(setPeriod),
    }),
    {
      setValue: createValueSetter(setLocation),
      name: 'Location',
      options: locationList,
      selectedValue: selectedLocation,
      title: 'Location',
    },
  ] as const satisfies FilterConfig[]

  return <StickyFilterBar filters={filters} showSearch={false} />
}
