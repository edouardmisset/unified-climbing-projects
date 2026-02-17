import type { Ascent } from '~/schema/ascent'

/**
 * Calculates the ratio of onsight and flash ascents
 *
 * @param {Ascent[]} ascents - The list of ascents
 * @returns {number} Ratio [0-1] of onsight and flash ascents
 */
export function calculateOnsightFlashRatio(ascents: Ascent[]): number {
  if (ascents.length === 0) return 0

  const onsightFlashCount = ascents.reduce(
    (count, { style }) => (style === 'Flash' || style === 'Onsight' ? count + 1 : count),
    0,
  )

  return onsightFlashCount / ascents.length
}
