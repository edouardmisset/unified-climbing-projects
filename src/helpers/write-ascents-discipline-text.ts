import type { Ascent } from '~/schema/ascent'
import { selectEnglishPluralForm } from './format-plurals'

const ENGLISH_CLIMBING_ACTIVITY = {
  ascent: {
    one: 'ascent',
    other: 'ascents',
  },
  Boulder: {
    one: 'boulder',
    other: 'boulders',
  },
  'Multi-Pitch': {
    one: 'multi-pitch',
    other: 'multi-pitches',
  },
  Route: {
    one: 'route',
    other: 'routes',
  },
} as const satisfies Record<string, { one: string; other: string }>

type ClimbingActivity = (typeof ENGLISH_CLIMBING_ACTIVITY)[keyof typeof ENGLISH_CLIMBING_ACTIVITY][
  | 'one'
  | 'other']

/**
 * Generates a text for ascents based on their climbing discipline.
 *
 * - If there are no ascents, returns "ascents".
 * - If ascents have mixed disciplines, returns "ascent" (if one ascent) or "ascents" (if more than one).
 * - If all ascents share the same discipline, returns the discipline in lowercase with no trailing "s" if there is a single ascent,
 *   or with an "s" if there are multiple ascents.
 *
 * @param {Pick<Ascent, 'climbingDiscipline'>[]} ascents - The list of ascent objects.
 * @returns {ClimbingActivity} The text for the ascents ('boulder', 'boulders',
 * 'route', etc).
 */
export function writeAscentsDisciplineText(
  ascents: Pick<Ascent, 'climbingDiscipline'>[],
): ClimbingActivity {
  if (ascents[0] === undefined) return ENGLISH_CLIMBING_ACTIVITY.ascent.other

  const firstDiscipline = ascents[0].climbingDiscipline

  for (const { climbingDiscipline } of ascents)
    if (climbingDiscipline !== firstDiscipline)
      return selectEnglishPluralForm(ascents.length, ENGLISH_CLIMBING_ACTIVITY.ascent)

  return selectEnglishPluralForm(ascents.length, ENGLISH_CLIMBING_ACTIVITY[firstDiscipline])
}
