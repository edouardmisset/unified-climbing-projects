import { objectSize } from '@edouardmisset/object'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { Ascent } from '~/schema/ascent'
import type { OptionalAscentFilter } from '~/server/api/routers/ascents'
import { fromGradeToNumber } from './converters.ts'
import { frequencyBy } from './frequency-by.ts'
import { isDateInYear } from './is-date-in-year.ts'

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
    return ascents[0] as Ascent
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
