import { average } from '@edouardmisset/math/average.ts'
import { NOT_AVAILABLE } from '~/constants/generic'
import type { Ascent } from '~/schema/ascent'
import { fromGradeToNumber, fromNumberToGrade } from './converters'

export function getAverageGrade(ascents: Ascent[]) {
  if (ascents.length === 0) return NOT_AVAILABLE

  const numericGrades = ascents.map(({ topoGrade }) =>
    fromGradeToNumber(topoGrade),
  )
  const avg = average(...numericGrades)
  return fromNumberToGrade(Math.round(avg))
}
