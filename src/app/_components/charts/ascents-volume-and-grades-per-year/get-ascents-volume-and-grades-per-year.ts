import { average } from '@edouardmisset/math/average.ts'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import type { Ascent } from '~/schema/ascent'

type AscentsVolumeAndGradesPerYearDatum = {
  Bouldering: number
  Sport: number
  avgBoulderGrade: number | undefined
  avgRouteGrade: number | undefined
  maxBoulderGrade: number | undefined
  maxRouteGrade: number | undefined
  year: number
}

function getGradeStats(gradeNumbers: number[]): GetGradeStatsResult {
  if (gradeNumbers.length === 0) return { avg: undefined, max: undefined }

  const averageGrade = average(...gradeNumbers)
  if (averageGrade.error) return { avg: undefined, max: undefined }

  return {
    avg: Math.round(averageGrade.data),
    max: Math.max(...gradeNumbers),
  }
}

type GetGradeStatsResult = { avg: undefined; max: undefined } | { avg: number; max: number }

export function getAscentsVolumeAndGradesPerYear(
  ascents: Ascent[],
): AscentsVolumeAndGradesPerYearDatum[] {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const boulderGrades: number[] = []
    const routeGrades: number[] = []

    for (const { discipline, date, grade } of ascents) {
      if (!isDateInYear(date, year)) continue
      if (discipline === 'Bouldering') boulderGrades.push(fromGradeToNumber(grade))
      if (discipline === 'Sport') routeGrades.push(fromGradeToNumber(grade))
    }

    const boulderGradeStats = getGradeStats(boulderGrades)
    const routeGradeStats = getGradeStats(routeGrades)

    return {
      Bouldering: boulderGrades.length,
      Sport: routeGrades.length,
      avgBoulderGrade: boulderGradeStats.avg,
      avgRouteGrade: routeGradeStats.avg,
      maxBoulderGrade: boulderGradeStats.max,
      maxRouteGrade: routeGradeStats.max,
      year,
    }
  })
}
