import { useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'

export function AscentsQRDot({
  ascents,
}: {
  ascents?: Ascent[]
}) {
  if (ascents === undefined || ascents.length === 0) return <span />

  const hardestAscent = useMemo(() => getHardestAscent(ascents), [ascents])

  return (
    <span
      className={fromGradeToClassName(hardestAscent?.topoGrade)}
      title={createAscentsQRTooltip(ascents)}
    />
  )
}
