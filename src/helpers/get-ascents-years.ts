import { createYearList } from '~/data/ascent-data'
import type { Ascent } from '~/schema/ascent'

export function getAscentsYears(
  ascents: Ascent[],
  options?: { descending?: boolean },
) {
  const { descending = false } = options ?? {}
  return createYearList(ascents, { descending })
}
