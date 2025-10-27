import type { Ascent } from '~/schema/ascent'

/**
 * Calculates the efficiency based on average tries per ascent
 * Fewer tries per ascent indicates higher efficiency
 *
 * @param {Ascent[]} ascents - The list of ascents
 * @returns {number} Ratio (0-1) based on average tries (ascents/total tries)
 */
export function calculateAverageTries(ascents: Ascent[]): number {
  if (ascents.length === 0) return 0

  const totalTries = ascents.reduce((sum, { tries }) => sum + tries, 0)

  return totalTries === 0 ? 0 : ascents.length / totalTries
}
