import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { ASCENT_STYLE, type Ascent, AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { PERIOD } from '~/schema/generic'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import type { FilterConfig } from '../types'

export default function AscentsFilterBar({
  allAscents,
  showSearch,
}: {
  allAscents: Ascent[]
  showSearch: boolean
}) {
  const yearList = useMemo(
    () =>
      createYearList(allAscents, {
        descending: true,
        continuous: false,
      }).map(String),
    [allAscents],
  )

  const cragList = useMemo(
    () =>
      [...new Set(allAscents.map(({ crag }) => crag.trim()))]
        .filter(Boolean)
        .sort((a, b) => compareStringsAscending(a, b)),
    [allAscents],
  )

  const {
    selectedCrag,
    selectedDiscipline,
    selectedPeriod,
    selectedStyle,
    selectedYear,
    setCrag,
    setDiscipline,
    setPeriod,
    setStyle,
    setYear,
    selectedRoute,
    setRoute,
  } = useAscentsQueryState()

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          setValue: createValueSetter(setDiscipline),
          name: 'Discipline',
          options: AVAILABLE_CLIMBING_DISCIPLINE,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          setValue: createValueSetter(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          setValue: createValueSetter(setCrag),
          name: 'Crag',
          options: cragList,
          selectedValue: selectedCrag,
          title: 'Crag',
        },
        {
          setValue: createValueSetter(setStyle),
          name: 'Style',
          options: ASCENT_STYLE,
          selectedValue: selectedStyle,
          title: 'Ascent Style',
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
      cragList,
      selectedCrag,
      selectedDiscipline,
      selectedPeriod,
      selectedStyle,
      selectedYear,
      setCrag,
      setDiscipline,
      setPeriod,
      setStyle,
      setYear,
      yearList,
    ],
  )

  return (
    <StickyFilterBar
      filters={filters}
      search={selectedRoute}
      setSearch={setRoute}
      showSearch={showSearch}
    />
  )
}
