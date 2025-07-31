import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterAscents } from '~/helpers/filter-ascents'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import type { Ascent } from '~/schema/ascent'
import { useAscentsQueryState } from './use-ascents-query-state'

/**
 * Filters the provided ascents based on the following query state parameters:
 * year, discipline, style, crag, and grade.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @returns {Ascent[]} The filtered ascents.
 */
export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  const {
    selectedYear,
    selectedDiscipline,
    selectedStyle,
    selectedCrag,
    selectedGrade,
  } = useAscentsQueryState()

  const filteredAscents = useMemo(() => {
    const selectedYearNumber = Number(selectedYear)

    return filterAscents(ascents, {
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      crag: normalizeFilterValue(selectedCrag),
      grade: normalizeFilterValue(selectedGrade),
      style: normalizeFilterValue(selectedStyle),
      year:
        selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
    })
  }, [
    ascents,
    selectedCrag,
    selectedDiscipline,
    selectedGrade,
    selectedStyle,
    selectedYear,
  ])

  return filteredAscents
}
