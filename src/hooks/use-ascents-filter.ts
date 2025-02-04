import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import type { OrAll } from '~/app/_components/dashboard/types'
import { filterAscents } from '~/helpers/filter-ascents'
import {
  type Ascent,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
} from '~/schema/ascent'

/**
 * Filters the provided ascents based on the following query state parameters:
 * year, discipline, style, crag, and grade.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @returns {Ascent[]} The filtered ascents.
 */
export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  const [selectedYear] = useQueryState<OrAll<number>>('year', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : Number(value)),
  })
  const [selectedDiscipline] = useQueryState<
    OrAll<Ascent['climbingDiscipline']>
  >('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : climbingDisciplineSchema.parse(value),
  })
  const [selectedStyle] = useQueryState<OrAll<Ascent['style']>>('style', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : ascentStyleSchema.parse(value),
  })
  const [selectedCrag] = useQueryState<OrAll<Ascent['crag']>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
  })
  const [selectedGrade] = useQueryState<OrAll<Ascent['topoGrade']>>('grade', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : gradeSchema.parse(value),
  })

  const filteredAscents = useMemo(
    () =>
      filterAscents(ascents, {
        year: selectedYear === ALL_VALUE ? undefined : Number(selectedYear),
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
