import { average } from '@edouardmisset/math/average.ts'
import { isDateInYear } from '@edouardmisset/date/is-date-in-year.ts'
import { createYearList } from '~/data/helpers'
import { fromGradeToNumber } from '~/helpers/grade-converter'
import type { Ascent } from '~/schema/ascent'

export type AscentsVolumeAndGradesPerYearDatum = {
  Boulder: number
  Route: number
  avgBoulderGrade: number | undefined
  avgRouteGrade: number | undefined
  maxBoulderGrade: number | undefined
  maxRouteGrade: number | undefined
  year: number
}

function getGradeStats(gradeNumbers: number[]): {
  avg: number | undefined
  max: number | undefined
} {
  if (gradeNumbers.length === 0) return { avg: undefined, max: undefined }

  return {
    avg: Math.round(average(...gradeNumbers)),
    max: Math.max(...gradeNumbers),
  }
}

export function getAscentsVolumeAndGradesPerYear(
  ascents: Ascent[],
): AscentsVolumeAndGradesPerYearDatum[] {
  if (ascents.length === 0) return []

  const years = createYearList(ascents, { descending: false, continuous: true })

  return years.map(year => {
    const boulderGrades: number[] = []
    const routeGrades: number[] = []

    for (const { climbingDiscipline, date, topoGrade } of ascents) {
      if (!isDateInYear(date, year)) continue
      if (climbingDiscipline === 'Boulder') boulderGrades.push(fromGradeToNumber(topoGrade))
      if (climbingDiscipline === 'Route') routeGrades.push(fromGradeToNumber(topoGrade))
    }

    const boulderGradeStats = getGradeStats(boulderGrades)
    const routeGradeStats = getGradeStats(routeGrades)

    return {
      Boulder: boulderGrades.length,
      Route: routeGrades.length,
      avgBoulderGrade: boulderGradeStats.avg,
      avgRouteGrade: routeGradeStats.avg,
      maxBoulderGrade: boulderGradeStats.max,
      maxRouteGrade: routeGradeStats.max,
      year,
    }
  })
}
