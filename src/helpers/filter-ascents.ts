import { objectSize } from '@edouardmisset/object/object-size.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import type { Ascent } from '~/schema/ascent'
import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { frequencyBy } from './frequency-by.ts'
import { fromGradeToNumber } from './grade-converter.ts'
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
  return ascents.reduce(
    (hardestAscent, currentAscent) => {
      const hardestGrade = fromGradeToNumber(hardestAscent.topoGrade)
      const currentGrade = fromGradeToNumber(currentAscent.topoGrade)

      const isCurrentAscentHarder = hardestGrade < currentGrade

      if (isCurrentAscentHarder) return currentAscent

      return hardestAscent
    },
    { topoGrade: '1a' } as Ascent,
  )
}

export function getCragsDetails(ascents: Ascent[]): {
  numberOfCrags: number
  mostFrequentCrag: string | undefined
  crags: Ascent['crag'][]
} {
  const cragsByFrequency = frequencyBy(ascents, 'crag', { ascending: false })
  const crags = Object.keys(cragsByFrequency)
  const [mostFrequentCrag] = crags

  return {
    numberOfCrags: objectSize(cragsByFrequency),
    mostFrequentCrag,
    crags,
  }
}
