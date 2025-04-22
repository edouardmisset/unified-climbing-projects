import type { Ascent } from '~/schema/ascent'
import { fromAscentToPoints } from './ascent-converter'

export function calculateTopTenScore(ascents: Ascent[]): number {
  return ascents
    .map(ascent => fromAscentToPoints(ascent))
    .sort((a, b) => b - a)
    .slice(0, 10)
    .reduce((acc, points) => acc + points, 0)
}
