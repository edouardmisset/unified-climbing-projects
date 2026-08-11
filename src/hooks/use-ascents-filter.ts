import { isValidNumber } from '@edouardmisset/math'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import {
  deriveAscentFilterModel,
  type AscentFilterFacets,
} from '~/helpers/derive-ascent-filter-model'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import type { Ascent } from '~/schema/ascent'
import { useAscentsQueryState } from './use-ascents-query-state'

/**
 * Filters the provided ascents based on the following query state parameters:
 * year, discipline, style, crag, and grade and period.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @returns {Ascent[]} The filtered ascents.
 */
export function useAscentsFilterModel(ascents: Ascent[]): {
  ascents: Ascent[]
  facets: AscentFilterFacets
} {
  const {
    selectedYear,
    selectedArea,
    selectedCrag,
    selectedDiscipline,
    selectedGrade,
    selectedPeriod,
    selectedRoute,
    selectedStyle,
  } = useAscentsQueryState()

  const selectedYearNumber = Number(selectedYear)
  return deriveAscentFilterModel(ascents, {
    area: normalizeFilterValue(selectedArea),
    crag: normalizeFilterValue(selectedCrag),
    discipline: normalizeFilterValue(selectedDiscipline),
    grade: normalizeFilterValue(selectedGrade),
    period: normalizeFilterValue(selectedPeriod),
    route: selectedRoute,
    style: normalizeFilterValue(selectedStyle),
    year:
      selectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
        ? selectedYearNumber
        : undefined,
  })
}

export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  return useAscentsFilterModel(ascents).ascents
}
