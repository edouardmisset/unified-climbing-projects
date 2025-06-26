import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterAscents } from '~/helpers/filter-ascents'
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

  return useMemo(
    () =>
      filterAscents(ascents, {
        climbingDiscipline:
          selectedDiscipline === ALL_VALUE ? undefined : selectedDiscipline,
        crag: selectedCrag === ALL_VALUE ? undefined : selectedCrag,
        grade: selectedGrade === ALL_VALUE ? undefined : selectedGrade,
        style: selectedStyle === ALL_VALUE ? undefined : selectedStyle,
        year:
          selectedYear !== ALL_VALUE && isValidNumber(Number(selectedYear))
            ? Number(selectedYear)
            : undefined,
      }),
    [
      ascents,
      selectedCrag,
      selectedDiscipline,
      selectedGrade,
      selectedStyle,
      selectedYear,
    ],
  )
}
