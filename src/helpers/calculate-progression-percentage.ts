import type { Ascent, Grade } from '~/schema/ascent'
import { fromGradeToNumber } from './grade-converter'
import { minMaxGrades } from './min-max-grades'

/**
 * Calculates the progression percentage by comparing climbing performance between years.
 *
 * The function measures progression by tracking whether the hardest grades achieved in the current
 * year are higher than those achieved in the previous year across different climbing disciplines
 * and styles.
 *
 * Five key categories are evaluated:
 * - Boulder Redpoint (hardest boulder problems climbed after multiple attempts)
 * - Boulder Flash (hardest boulder problems climbed first try with prior knowledge)
 * - Route Redpoint (hardest routes climbed after multiple attempts)
 * - Route Flash (hardest routes climbed first try with prior knowledge)
 * - Route Onsight (hardest routes climbed first try with no prior knowledge)
 *
 * For each category, the function compares the hardest grade achieved in the current year with
 * the hardest grade achieved in the previous year. Each category where progression is observed
 * (current year grade > previous year grade) contributes equally to the overall score.
 *
 * The final progression percentage represents how many of the five key categories show improvement.
 *
 * @param {Object} params - The parameters object
 * @param {Ascent[]} params.ascents - Array of ascent data to analyze for progression
 * @param {number} params.year - The current year to compare against the previous year
 * @returns {number} - Progression percentage from 0-100
 */
export function calculateProgressionPercentage({
  ascents,
  year,
}: {
  ascents: Ascent[]
  year: number
}): number {
  if (ascents.length === 0) return 0

  const previousYear = year - 1

  const categories = [
    { discipline: 'Bouldering', style: 'Redpoint' },
    { discipline: 'Bouldering', style: 'Flash' },
    { discipline: 'Sport', style: 'Redpoint' },
    { discipline: 'Sport', style: 'Flash' },
    { discipline: 'Sport', style: 'Onsight' },
  ] as const satisfies Pick<Ascent, 'discipline' | 'style'>[]

  // Create lookup maps by year for quick filtering
  const currentYearAscents: Ascent[] = []
  const previousYearAscents: Ascent[] = []

  // Pre-filter and group ascents by year
  for (const ascent of ascents) {
    const ascentYear = new Date(ascent.date).getFullYear()

    if (ascentYear === year) {
      currentYearAscents.push(ascent)
    }

    if (ascentYear === previousYear) {
      previousYearAscents.push(ascent)
    }
  }

  if (currentYearAscents.length === 0) return 0

  const currentYearMap = createHardestGradeMap(currentYearAscents)
  const previousYearMap = createHardestGradeMap(previousYearAscents)

  let progressionCount = 0

  for (const { discipline, style } of categories) {
    const categoryKey = generateCategoryKey(discipline, style)

    const currentYearHardest = currentYearMap.get(categoryKey)
    const previousYearHardest = previousYearMap.get(categoryKey)

    if (currentYearHardest === undefined) continue

    if (previousYearHardest === undefined && currentYearHardest !== undefined) {
      progressionCount++
      continue
    }

    const isClimbingProgressing =
      fromGradeToNumber(currentYearHardest) >
      fromGradeToNumber(previousYearHardest as Grade)

    if (isClimbingProgressing) progressionCount++
  }

  return Math.round((progressionCount / categories.length) * 100)
}

/**
 * Helper function to create a map of the hardest grades for each category
 */
export function createHardestGradeMap(
  ascents: Ascent[],
): Map<ReturnType<typeof generateCategoryKey>, Grade> {
  const gradeMap = new Map<ReturnType<typeof generateCategoryKey>, Grade>()

  // Group ascents by category
  const categoryGroups = new Map<
    ReturnType<typeof generateCategoryKey>,
    Ascent[]
  >()

  for (const ascent of ascents) {
    const key = generateCategoryKey(ascent.discipline, ascent.style)

    if (!categoryGroups.has(key)) categoryGroups.set(key, [])

    const categoryGroupData = categoryGroups.get(key)
    if (categoryGroupData === undefined) continue

    categoryGroupData.push(ascent)
  }

  // Get hardest grade for each category
  for (const [key, categoryAscents] of categoryGroups.entries()) {
    const [, hardestGrade] = minMaxGrades(categoryAscents)
    gradeMap.set(key, hardestGrade)
  }

  return gradeMap
}

function generateCategoryKey(
  climbingDiscipline: Ascent['discipline'],
  style: Ascent['style'],
): `${Ascent['discipline']}-${Ascent['style']}` {
  return `${climbingDiscipline}-${style}`
}
