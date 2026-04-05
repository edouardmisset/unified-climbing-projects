import { createYearList } from '~/data/helpers'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import { filterAscents } from '~/helpers/filter-ascents'
import type { Ascent, Grade } from '~/schema/ascent'

type GradeColorKey = `${Grade}Color`

export type AscentsPerYearByGradeDatum = {
  year: number
} & Partial<Record<Grade, number>> &
  Partial<Record<GradeColorKey, string>>

export function getAscentsPerYearByGrade(ascents: Ascent[]): AscentsPerYearByGradeDatum[] {
  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const ascentsForYear = filterAscents(ascents, { year })

    if (ascentsForYear.length === 0) return { year }

    const gradeScale = createGradeScaleFromAscents(ascentsForYear)

    const frequency: Omit<AscentsPerYearByGradeDatum, 'year'> = {}

    for (const grade of gradeScale) {
      frequency[grade] = 0
      const gradeColorKey = `${grade}Color` as GradeColorKey
      frequency[gradeColorKey] = fromGradeToBackgroundColor(grade)
    }

    // Calculate frequency counts in a single pass over the ascents
    for (const { topoGrade } of ascentsForYear) {
      const value = frequency[topoGrade]
      if (typeof value !== 'number') continue

      frequency[topoGrade] = value + 1
    }

    return { year, ...frequency }
  })
}
