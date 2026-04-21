import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { stringIncludesCaseInsensitive } from '@edouardmisset/text'
import { useDeferredValue, useMemo } from 'react'
import { ALL_VALUE } from '~/shared/components/dashboard/constants'
import { filterAscents } from '~/ascents/helpers/filter-ascents'
import { normalizeFilterValue } from '~/shared/helpers/normalize-filter-value'
import type { Ascent } from '~/ascents/schema'
import { useAscentsQueryState } from './use-ascents-query-state'

/**
 * Filters the provided ascents based on the following query state parameters:
 * year, discipline, style, crag, and grade and period.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @returns {Ascent[]} The filtered ascents.
 */
export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
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

  const filteredAscents = useMemo(() => {
    const selectedYearNumber = Number(deferredSelectedYear)

    return filterAscents(ascents, {
      area: normalizeFilterValue(deferredSelectedArea),
      climbingDiscipline: normalizeFilterValue(deferredSelectedDiscipline),
      crag: normalizeFilterValue(deferredSelectedCrag),
      grade: normalizeFilterValue(deferredSelectedGrade),
      style: normalizeFilterValue(deferredSelectedStyle),
      year:
        deferredSelectedYear !== ALL_VALUE && isValidNumber(selectedYearNumber)
          ? selectedYearNumber
          : undefined,
      period: normalizeFilterValue(deferredSelectedPeriod),
    })
  }, [
    ascents,
    deferredSelectedArea,
    deferredSelectedCrag,
    deferredSelectedDiscipline,
    deferredSelectedGrade,
    deferredSelectedPeriod,
    deferredSelectedStyle,
    deferredSelectedYear,
  ])

  return useMemo(
    () =>
      deferredSelectedRoute === ''
        ? filteredAscents
        : filteredAscents.filter(({ routeName }) =>
            stringIncludesCaseInsensitive(routeName, deferredSelectedRoute),
          ),
    [deferredSelectedRoute, filteredAscents],
  )
}
