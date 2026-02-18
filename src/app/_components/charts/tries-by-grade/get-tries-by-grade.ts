import { compareStringsAscending } from '~/helpers/sort-strings'
import type { Ascent, Grade } from '~/schema/ascent'
import type { LineChartDataStructure } from './tries-by-grade'

export function getTriesByGrade(ascents: Ascent[]): LineChartDataStructure[] {
  if (ascents.length === 0) return []

  const gradeStats = new Map<Grade, { min: number; max: number; sum: number; count: number }>()

  for (const { topoGrade, tries } of ascents) {
    const topoGradeStat = gradeStats.get(topoGrade)
    if (!topoGradeStat) {
      gradeStats.set(topoGrade, { count: 1, max: tries, min: tries, sum: tries })
      continue
    }

    topoGradeStat.min = Math.min(topoGradeStat.min, tries)
    topoGradeStat.max = Math.max(topoGradeStat.max, tries)
    topoGradeStat.sum += tries
    topoGradeStat.count++
  }

  const grades = Array.from(gradeStats.keys()).sort((a, b) => compareStringsAscending(a, b))

  return [
    {
      color: 'var(--minTries)',
      data: grades.map(grade => ({
        x: grade,
        y: gradeStats.get(grade)?.min ?? 0,
      })),
      id: 'min',
    },
    {
      color: 'var(--averageTries)',
      data: grades.map(grade => {
        const { sum, count } = gradeStats.get(grade) ?? { sum: 0, count: 1 }
        return {
          x: grade,
          y: Math.round(sum / count),
        }
      }),
      id: 'average',
    },
    {
      color: 'var(--maxTries)',
      data: grades.map(grade => ({
        x: grade,
        y: gradeStats.get(grade)?.max ?? 0,
      })),
      id: 'max',
    },
  ]
}
