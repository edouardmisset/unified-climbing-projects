import { average } from '@edouardmisset/math'
import {
  COEFFICIENT_DISCRETE_HEIGHTS,
  COEFFICIENT_NUMBER_OF_CRAGS,
} from '~/constants/ascents'
import { ASCENT_STYLE, type Ascent, HOLDS, PROFILES } from '~/schema/ascent'

/**
 * Calculates the versatility percentage based on ascent data.
 *
 * Versatility is measured by the variety of climbing attributes across a set of
 * ascents:
 * - Holds types used (crimp, jug, pocket, etc.)
 * - Heights of climbs
 * - Wall profiles (slab, vertical, overhang, etc.)
 * - Climbing styles (onsight, flash, redpoint)
 * - Number of different crags visited
 *
 * Each attribute's versatility is calculated as the ratio of unique values to
 * the total possible values.
 * The overall versatility is the average of these individual ratios, expressed
 * as a percentage.
 *
 * @param {Ascent[]} ascents - Array of ascent data to calculate versatility from
 * @returns {number} - Versatility percentage from 0-100
 */
export function calculateVersatilityPercentage(ascents: Ascent[]): number {
  if (ascents.length === 0) return 0

  const uniqueHolds = new Set<Required<Ascent>['holds']>()
  const uniqueHeights = new Set<Required<Ascent>['height']>()
  const uniqueProfiles = new Set<Required<Ascent>['profile']>()
  const uniqueStyles = new Set<Ascent['style']>()
  const uniqueCrags = new Set<Ascent['crag']>()

  for (const { holds, height, profile, style, crag } of ascents) {
    if (holds) uniqueHolds.add(holds)
    if (height) uniqueHeights.add(height)
    if (profile) uniqueProfiles.add(profile)
    if (crag !== '') uniqueCrags.add(crag)
    uniqueStyles.add(style)
  }

  const holdsRatio = uniqueHolds.size / HOLDS.length
  const heightRatio = Math.min(
    uniqueHeights.size / COEFFICIENT_DISCRETE_HEIGHTS,
    1,
  )
  const profileRatio = uniqueProfiles.size / PROFILES.length
  const styleRatio = uniqueStyles.size / ASCENT_STYLE.length
  const cragRatio = uniqueCrags.size / COEFFICIENT_NUMBER_OF_CRAGS

  const ratios = [holdsRatio, heightRatio, profileRatio, styleRatio, cragRatio]

  return Math.round(average(ratios) * 100)
}
