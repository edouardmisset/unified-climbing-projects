import { objectSize } from '@edouardmisset/object/object-size.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import { type Ascent, ascentSchema } from '~/schema/ascent'
import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { fromGradeToNumber } from './converters.ts'
import { frequencyBy } from './frequency-by.ts'
import { isDateInYear } from './is-date-in-year.ts'

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
export function filterAscents(
  ascents: Ascent[],
  filters?: OptionalAscentFilter,
): Ascent[] {
  const {
    climbingDiscipline,
    crag,
    grade,
    height,
    holds,
    profile,
    rating,
    style,
    tries,
    year,
  } = filters ?? {}

  if (!ascents || ascents.length === 0) {
    globalThis.console.log('No ascents passed to filterAscents')
    return []
  }

  return ascents.filter(
    ascent =>
      (grade === undefined ||
        stringEqualsCaseInsensitive(ascent.topoGrade, grade)) &&
      (climbingDiscipline === undefined ||
        ascent.climbingDiscipline === climbingDiscipline) &&
      (year === undefined || isDateInYear(ascent.date, year)) &&
      (style === undefined || ascent.style === style) &&
      (profile === undefined || ascent.profile === profile) &&
      (rating === undefined || ascent.rating === rating) &&
      (height === undefined || ascent.height === height) &&
      (holds === undefined || ascent.holds === holds) &&
      (tries === undefined || ascent.tries === tries) &&
      (crag === undefined || stringEqualsCaseInsensitive(ascent.crag, crag)),
  )
}

export function getHardestAscent(ascents: Ascent[]): Ascent {
  const maxNumberGrade = Math.max(
    ...ascents.map(({ topoGrade }) => fromGradeToNumber(topoGrade)),
  )
  const hardestAscent = ascents.find(
    ({ topoGrade }) => fromGradeToNumber(topoGrade) === maxNumberGrade,
  )

  if (!hardestAscent) {
    globalThis.console.error('No ascent found')
    return ascentSchema.parse(ascents[0])
  }

  return hardestAscent
}

export function getMostFrequentCrag(ascents: Ascent[]) {
  const sortedCragFrequency = frequencyBy(ascents, 'crag', { ascending: false })

  return {
    numberOfCrags: objectSize(sortedCragFrequency),
    mostFrequentCrag: Object.keys(sortedCragFrequency)[0],
  }
}
