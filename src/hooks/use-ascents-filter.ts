import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { stringIncludesCaseInsensitive } from '@edouardmisset/text'
import { useDeferredValue, useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { filterAscents } from '~/helpers/filter-ascents'
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
export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  const {
    selectedYear,
    selectedCrag,
    selectedDiscipline,
    selectedGrade,
    selectedPeriod,
    selectedRoute,
    selectedStyle,
  } = useAscentsQueryState()

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
