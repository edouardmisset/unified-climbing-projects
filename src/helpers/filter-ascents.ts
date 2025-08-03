import { isDateInRange } from '@edouardmisset/date'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { objectKeys } from '@edouardmisset/object'
import { objectSize } from '@edouardmisset/object/object-size.ts'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text/string-equals.ts'
import { DEFAULT_GRADE } from '~/constants/ascents.ts'
import type { Ascent } from '~/schema/ascent.ts'
import { PERIOD_TO_DATES } from '~/schema/generic.ts'
import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { frequencyBy } from './frequency-by.ts'
import { fromGradeToNumber } from './grade-converter.ts'

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
    period,
  } = filters ?? {}

  if (!ascents || ascents.length === 0) {
    globalThis.console.log('No ascents passed to `filterAscents`')
    return []
  }

  return ascents.filter(ascent => {
    const ascentDate = new Date(ascent.date)
    return (
      (grade === undefined ||
        stringEqualsCaseInsensitive(ascent.topoGrade, grade)) &&
      (climbingDiscipline === undefined ||
        ascent.climbingDiscipline === climbingDiscipline) &&
      (year === undefined || isDateInYear(ascentDate, year)) &&
      (style === undefined || ascent.style === style) &&
      (profile === undefined || ascent.profile === profile) &&
      (rating === undefined || ascent.rating === rating) &&
      (height === undefined || ascent.height === height) &&
      (holds === undefined || ascent.holds === holds) &&
      (tries === undefined || ascent.tries === tries) &&
      (crag === undefined || stringEqualsCaseInsensitive(ascent.crag, crag)) &&
      (period === undefined ||
        isDateInRange(ascentDate, { ...PERIOD_TO_DATES[period] }))
    )
  })
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
    { topoGrade: DEFAULT_GRADE } as Ascent,
  )
}

export function getCragsDetails(ascents: Ascent[]): {
  numberOfCrags: number
  mostFrequentCrag: string | undefined
  crags: Ascent['crag'][]
} {
  const cragsByFrequency = frequencyBy(ascents, 'crag', { ascending: false })
  const crags = objectKeys(cragsByFrequency)
  const [mostFrequentCrag] = crags

  return {
    crags,
    mostFrequentCrag,
    numberOfCrags: objectSize(cragsByFrequency),
  }
}
