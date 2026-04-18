import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
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

  const selectedYearNumber = useMemo(() => {
    const n = Number(selectedYear)
    return selectedYear !== ALL_VALUE && isValidNumber(n) ? n : undefined
  }, [selectedYear])

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
    const filteredForDiscipline = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      locationType: normalizeFilterValue(selectedLocationType),
      period: normalizeFilterValue(selectedPeriod),
    })
    return AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
      filteredForDiscipline.some(session => session.climbingDiscipline === discipline),
    )
  }, [trainingSessions, selectedYearNumber, selectedLocationType, selectedPeriod])

  const locationTypeList = useMemo(() => {
    const filteredForLocationType = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      period: normalizeFilterValue(selectedPeriod),
    })
    const hasIndoor = filteredForLocationType.some(({ sessionType }) =>
      isIndoorSession({ sessionType }),
    )
    const hasOutdoor = filteredForLocationType.some(({ sessionType }) => sessionType === 'Out')
    return LOCATION_TYPES.filter(locationType =>
      locationType === 'Indoor' ? hasIndoor : hasOutdoor,
    )
  }, [trainingSessions, selectedYearNumber, selectedDiscipline, selectedPeriod])

  const periodList = useMemo(() => {
    const filteredForPeriod = filterTrainingSessions(trainingSessions, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      locationType: normalizeFilterValue(selectedLocationType),
    })
    return PERIOD.filter(period =>
      filteredForPeriod.some(({ date }) =>
        isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
      ),
    )
  }, [trainingSessions, selectedYearNumber, selectedDiscipline, selectedLocationType])

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
