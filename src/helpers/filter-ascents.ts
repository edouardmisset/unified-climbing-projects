import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { z } from 'zod'
import type { Ascent } from '~/schema/ascent.ts'
import type { optionalAscentFilterSchema } from '~/types/optional-ascent-filter'
import { matchesText, matchesValue, matchesYear } from './filter-matchers.ts'
import { fromGradeToNumber } from './grade-converter.ts'
import { isDateInPeriod } from './period.ts'

type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

/**
 * Filters the provided ascents based on the given filter criteria.
 *
 * NB: `undefined` is pass through. Meaning that if a filter is `undefined`, no
 * ascents will be filtered out based on that criteria.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @param {OptionalAscentFilter} [filters] - An optional set of filter criteria.
 * @returns {Ascent[]} - The filtered array of ascents.
 */
export function filterAscents(ascents: Ascent[], filters?: OptionalAscentFilter): Ascent[] {
  const {
    area,
    discipline,
    crag,
    grade,
    height,
    holds,
    profile,
    rating,
    style,
    tries,
    year,
    period,
  } = filters ?? {}

  if (ascents.length === 0) return []

  return ascents.filter(ascent => {
    const ascentDate = new Date(ascent.date)
    return (
      matchesText(ascent.grade, grade) &&
      matchesValue(ascent.discipline, discipline) &&
      matchesYear(ascentDate, year) &&
      matchesValue(ascent.style, style) &&
      matchesValue(ascent.profile, profile) &&
      matchesValue(ascent.rating, rating) &&
      matchesValue(ascent.height, height) &&
      matchesValue(ascent.holds, holds) &&
      matchesValue(ascent.tries, tries) &&
      matchesText(ascent.crag, crag) &&
      matchesOptionalText(ascent.area, area) &&
      isDateInPeriod(ascentDate, period)
    )
  })
}

function matchesOptionalText(actual: string | undefined, expected: string | undefined): boolean {
  if (expected === undefined) return true
  return actual !== undefined && stringEqualsCaseInsensitive(actual, expected)
}

export function getHardestAscent(ascents: Ascent[]): Ascent | undefined {
  if (ascents.length === 0) return undefined

  return ascents.reduce((hardestAscent, currentAscent) => {
    const hardestGrade = fromGradeToNumber(hardestAscent.grade)
    const currentGrade = fromGradeToNumber(currentAscent.grade)

    const isCurrentAscentHarder = hardestGrade < currentGrade

    if (isCurrentAscentHarder) return currentAscent

    return hardestAscent
  })
}
