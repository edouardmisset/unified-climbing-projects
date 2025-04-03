import { objectKeys } from '@edouardmisset/object'
import { compareStringsAscending } from '~/helpers/sort-strings'
import type { Ascent, Grade } from '~/schema/ascent'
import type { LineChartDataStructure } from './tries-by-grade'

export function getTriesByGrade(ascents: Ascent[]): LineChartDataStructure[] {
  if (ascents.length === 0) return []

  const gradeStats = {} as Record<
    Grade,
    { min: number; max: number; sum: number; count: number }
  >

  for (const { topoGrade, tries } of ascents) {
    const topoGradeStat = gradeStats[topoGrade]
    if (!topoGradeStat) {
      gradeStats[topoGrade] = { min: tries, max: tries, sum: tries, count: 1 }
      continue
    }

    topoGradeStat.min = Math.min(topoGradeStat.min, tries)
    topoGradeStat.max = Math.max(topoGradeStat.max, tries)
    topoGradeStat.sum += tries
    topoGradeStat.count++
  }

  const grades = objectKeys(gradeStats).sort((a, b) =>
    compareStringsAscending(a, b),
  )

  return [
    {
      id: 'min',
      data: grades.map(grade => ({
        x: grade,
        y: gradeStats[grade].min,
      })),
      color: 'var(--min-tries)',
    },
    {
      id: 'average',
      data: grades.map(grade => {
        const { sum, count } = gradeStats[grade]
        return {
          x: grade,
          y: Math.round(sum / count),
        }
      }),
      color: 'var(--average-tries)',
    },
    {
      id: 'max',
      data: grades.map(grade => ({
        x: grade,
        y: gradeStats[grade].max,
      })),
      color: 'var(--max-tries)',
    },
  ]
}
