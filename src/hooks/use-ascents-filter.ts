import {
  deriveAscentFilterModel,
  type AscentFilterFacets,
} from '~/helpers/derive-ascent-filter-model'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { resolveDateSelection } from '~/helpers/period'
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

  const { period, year } = resolveDateSelection(selectedYear, selectedPeriod)
  return deriveAscentFilterModel(ascents, {
    area: normalizeFilterValue(selectedArea),
    crag: normalizeFilterValue(selectedCrag),
    discipline: normalizeFilterValue(selectedDiscipline),
    grade: normalizeFilterValue(selectedGrade),
    period,
    route: selectedRoute,
    style: normalizeFilterValue(selectedStyle),
    year,
  })
}

export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  return useAscentsFilterModel(ascents).ascents
}
