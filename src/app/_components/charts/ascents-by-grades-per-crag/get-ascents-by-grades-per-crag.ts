import { createGradeScaleFromAscents } from '~/helpers/create-grade-scale'
import type { Ascent, Grade } from '~/schema/ascent'

export type AscentsByGradesPerCragDatum = {
  crag: string
} & Partial<Record<Grade, number>>

/**
 * Aggregates ascents by crag and computes the frequency of each climbing grade.
 *
 * The function groups the provided ascents by their `crag` property and determines
 * the grade scale based on the minimum and maximum grades encountered in each
 * group.
 * It then creates a frequency object per crag that maps each grade within the scale
 * to its corresponding count.
 *
 * @param {Ascent[]} ascents - An array of ascent objects containing climb details.
 * @returns {AscentsByGradesPerCragDatum[]} An array of objects where each object includes:
 *  - `crag`: The crag name.
 *  - A count for each grade present in the grade scale.
 */
export function getAscentsByGradesPerCrag(ascents: Ascent[]): AscentsByGradesPerCragDatum[] {
  const cragMap: Record<string, Ascent[]> = {}

  for (const ascent of ascents) {
    const { crag } = ascent
    if (!cragMap[crag]) cragMap[crag] = []

    cragMap[crag].push(ascent)
  }

  const crags = Object.entries(cragMap)
    .map(([crag, cragAscents]) => ({
      ascents: cragAscents,
      count: cragAscents.length,
      crag,
    }))
    .toSorted((a, b) => b.count - a.count)
    .slice(0, 10)

  return crags.map(({ crag, ascents: cragAscents }) => {
    const gradeScale = createGradeScaleFromAscents(cragAscents)

    const frequency: AscentsByGradesPerCragDatum = { crag }

    for (const grade of gradeScale) frequency[grade] = 0

    for (const { topoGrade } of cragAscents) {
      const value = frequency[topoGrade]
      if (typeof value !== 'number') continue

      frequency[topoGrade] = value + 1
    }

    return frequency
  })
}
