import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { createGradeScale } from '~/helpers/create-grade-scale'
import { minMaxGrades } from '~/helpers/min-max-grades'
import type { Ascent } from '~/schema/ascent'

export function getAscentsByGradesPerCrag(
  ascents: Ascent[],
): Record<string, string | number>[] {
  const cragMap: Record<string, Ascent[]> = {}

  for (const ascent of ascents) {
    const { crag } = ascent
    if (!cragMap[crag]) {
      cragMap[crag] = []
    }
    cragMap[crag].push(ascent)
  }

  const crags = Object.entries(cragMap)
    .map(([crag, ascents]) => ({ crag, count: ascents.length, ascents }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return crags.map(({ crag, ascents }) => {
    const gradeScale = createGradeScale(...minMaxGrades(ascents))

    const frequency: Record<string, string | number> = { crag }

    for (const grade of gradeScale) {
      frequency[grade] = 0
      frequency[`${grade}Color`] = fromGradeToBackgroundColor(grade)
    }

    for (const { topoGrade } of ascents) {
      if (
        frequency[topoGrade] !== undefined &&
        typeof frequency[topoGrade] === 'number'
      ) {
        frequency[topoGrade] += 1
      }
    }

    return frequency
  })
}
