import { createYearList } from '~/data/helpers'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import { filterAscents } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'

export function getAscentsPerYearByGrade(ascents: Ascent[]): {
  year: number
  [grade: string]: number
}[] {
  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const ascentsForYear = filterAscents(ascents, { year })

    if (ascentsForYear.length === 0) {
      return { year }
    }

    const gradeScale = createGradeScaleFromAscents(ascentsForYear)

    const frequency: Record<string, string | number> = {}

    for (const grade of gradeScale) {
      frequency[grade] = 0
      frequency[`${grade}Color`] = fromGradeToBackgroundColor(grade)
    }

    // Calculate frequency counts in a single pass over the ascents
    for (const { topoGrade } of ascentsForYear) {
      if (frequency?.[topoGrade] === undefined || typeof frequency[topoGrade] !== 'number') {
        continue
      }

      frequency[topoGrade] += 1
    }

    return { year, ...frequency }
  })
}
