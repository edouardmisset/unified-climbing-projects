// oxlint-disable complexity
import { isDateInRange } from '@edouardmisset/date'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { z } from '~/helpers/zod'
import type { Ascent } from '~/schema/ascent.ts'
import { PERIOD_TO_DATES } from '~/schema/generic.ts'
import type { optionalAscentFilterSchema } from '~/types/optional-ascent-filter'
import { fromGradeToNumber } from './grade-converter.ts'

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
      matchesPeriod(ascentDate, period)
    )
  })
}

function matchesValue<T>(actual: T | undefined, expected: T | undefined): boolean {
  return expected === undefined || actual === expected
}

function matchesText(actual: string, expected: string | undefined): boolean {
  return expected === undefined || stringEqualsCaseInsensitive(actual, expected)
}

function matchesOptionalText(actual: string | undefined, expected: string | undefined): boolean {
  if (expected === undefined) return true
  return actual !== undefined && stringEqualsCaseInsensitive(actual, expected)
}

function matchesYear(date: Date, year: number | undefined): boolean {
  return year === undefined || isDateInYear(date, year)
}

function matchesPeriod(date: Date, period: NonNullable<OptionalAscentFilter>['period']): boolean {
  return (
    period === undefined ||
    (period in PERIOD_TO_DATES && isDateInRange(date, { ...PERIOD_TO_DATES[period] }))
  )
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
