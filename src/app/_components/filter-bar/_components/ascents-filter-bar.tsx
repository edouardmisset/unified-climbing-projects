import { useMemo } from 'react'
import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import {
  ASCENT_STYLE,
  type Ascent,
  AVAILABLE_CLIMBING_DISCIPLINE,
} from '~/schema/ascent'
import { createChangeHandler } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import type { FilterConfig } from '../types'

export default function AscentsFilterBar({
  allAscents,
}: {
  allAscents: Ascent[]
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
    selectedStyle,
    selectedYear,
    setCrag,
    setDiscipline,
    setStyle,
    setYear,
  } = useAscentsQueryState()

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          handleChange: createChangeHandler(setDiscipline),
          name: 'Discipline',
          options: AVAILABLE_CLIMBING_DISCIPLINE,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          handleChange: createChangeHandler(setStyle),
          name: 'Style',
          options: ASCENT_STYLE,
          selectedValue: selectedStyle,
          title: 'Ascent Style',
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
      ] as const satisfies FilterConfig[],
    [
      setDiscipline,
      setStyle,
      setYear,
      setCrag,
      selectedDiscipline,
      selectedStyle,
      selectedYear,
      selectedCrag,
      yearList,
      cragList,
    ],
  )

  return <StickyFilterBar filters={filters} />
}
