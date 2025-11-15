import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { ASCENT_STYLE, type Ascent } from '~/schema/ascent'
import { PERIOD } from '~/schema/generic'
import { createChangeHandler } from '../helpers'
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

  const disciplineList = useMemo(
    () => [...new Set(allAscents.map(({ discipline }) => discipline))],
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
          handleChange: createChangeHandler(setDiscipline),
          name: 'Discipline',
          options: disciplineList,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          handleChange: createChangeHandler(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          handleChange: createChangeHandler(setCrag),
          name: 'Crag',
          options: cragList,
          selectedValue: selectedCrag,
          title: 'Crag',
        },
        {
          handleChange: createChangeHandler(setStyle),
          name: 'Style',
          options: ASCENT_STYLE,
          selectedValue: selectedStyle,
          title: 'Ascent Style',
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
      cragList,
      disciplineList,
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
