import type { Ascent } from '~/schema/ascent'
import { fromAscentToPoints } from './ascent-converter'

/**
 * Calculates the total score from the hardest ten ascents.
 *
 * This function converts each ascent to its point value, sorts the values
 * in descending order, takes the top ten scores, and returns their sum.
 *
 * @param {Ascent[]} ascents - Array of ascent records to be scored
 * @returns {number} Sum of the top ten ascent points (or all points if fewer
 * than ten)
 * @see {@link fromAscentToPoints} for the conversion logic
 */
export function calculateTopTenScore(ascents: Ascent[]): number {
  return ascents
    .map(ascent => fromAscentToPoints(ascent))
    .sort((a, b) => b - a)
    .slice(0, 10)
    .reduce((acc, points) => acc + points, 0)
}
