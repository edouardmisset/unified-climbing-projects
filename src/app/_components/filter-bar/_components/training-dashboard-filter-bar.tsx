import { useMemo } from 'react'
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
          options: LOCATION_TYPES,
          selectedValue: selectedLocationType,
          title: 'Indoor / Outdoor',
        },
        {
          setValue: createValueSetter(setDiscipline),
          name: 'Discipline',
          options: AVAILABLE_CLIMBING_DISCIPLINE,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          setValue: createValueSetter(setPeriod),
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
