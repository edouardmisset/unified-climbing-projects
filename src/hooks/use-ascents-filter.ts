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

  const filteredAscents = useMemo(
    () =>
      filterAscents(ascents, {
        year:
          selectedYear !== ALL_VALUE && isValidNumber(selectedYear)
            ? Number(selectedYear)
            : undefined,
        climbingDiscipline:
          selectedDiscipline === ALL_VALUE ? undefined : selectedDiscipline,
        style: selectedStyle === ALL_VALUE ? undefined : selectedStyle,
        crag: selectedCrag === ALL_VALUE ? undefined : selectedCrag,
        grade: selectedGrade === ALL_VALUE ? undefined : selectedGrade,
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

  return filteredAscents
}
