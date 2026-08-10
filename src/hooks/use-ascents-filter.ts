import { isValidNumber } from '@edouardmisset/math'
import { useDeferredValue } from 'react'
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

  const deferredSelectedArea = useDeferredValue(selectedArea)
  const deferredSelectedCrag = useDeferredValue(selectedCrag)
  const deferredSelectedDiscipline = useDeferredValue(selectedDiscipline)
  const deferredSelectedGrade = useDeferredValue(selectedGrade)
  const deferredSelectedPeriod = useDeferredValue(selectedPeriod)
  const deferredSelectedRoute = useDeferredValue(selectedRoute)
  const deferredSelectedStyle = useDeferredValue(selectedStyle)
  const deferredSelectedYear = useDeferredValue(selectedYear)

  const selectedYearNumber = Number(deferredSelectedYear)
  return deriveAscentFilterModel(ascents, {
    area: normalizeFilterValue(deferredSelectedArea),
    crag: normalizeFilterValue(deferredSelectedCrag),
    discipline: normalizeFilterValue(deferredSelectedDiscipline),
    grade: normalizeFilterValue(deferredSelectedGrade),
    period: normalizeFilterValue(deferredSelectedPeriod),
    route: deferredSelectedRoute,
    style: normalizeFilterValue(deferredSelectedStyle),
    year:
      deferredSelectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
        ? selectedYearNumber
        : undefined,
  })
}

export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  return useAscentsFilterModel(ascents).ascents
}
