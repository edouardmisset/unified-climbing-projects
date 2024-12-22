import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { Ascent } from '~/schema/ascent'
import type { OptionalAscentInput } from '~/server/api/routers/grades'
import { isDateInYear } from './is-date-in-year.ts'

export function filterAscents(
  ascents: Ascent[],
  filters?: OptionalAscentInput,
): Ascent[] {
  const {
    climbingDiscipline,
    crag,
    grade,
    height,
    holds,
    profile,
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
      (height === undefined || ascent.height === height) &&
      (holds === undefined || ascent.holds === holds) &&
      (tries === undefined || ascent.tries === tries) &&
      (crag === undefined || stringEqualsCaseInsensitive(ascent.crag, crag)),
  )
}
