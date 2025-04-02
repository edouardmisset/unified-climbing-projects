import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { createGradeScale } from '~/helpers/create-grade-scale'
import { minMaxGrades } from '~/helpers/min-max-grades'
import type { Ascent } from '~/schema/ascent'

/**
 * Aggregates ascents by crag and computes the frequency of each climbing grade.
 *
 * The function groups the provided ascents by their `crag` property and determines
 * the grade scale based on the minimum and maximum grades encountered in each
 * group.
 * It then creates a frequency object per crag that maps each grade within the scale
 * to its corresponding count and assigns a background color for the grade.
 *
 * @param {Ascent[]} ascents - An array of ascent objects containing climb details.
 * @returns {Record<string, string | number>[]} An array of objects where each object includes:
 *  - `crag`: The crag name.
 *  - A count for each grade present in the grade scale.
 *  - A `<grade>Color` property for each grade representing its assigned background color.
 */
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
        frequency[topoGrade] === undefined ||
        typeof frequency[topoGrade] !== 'number'
      ) {
        continue
      }

      frequency[topoGrade] += 1
    }

    return frequency
  })
}
