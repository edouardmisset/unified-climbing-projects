import { useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { formatDateInTooltip } from '~/helpers/formatters'
import { AscentsInDayPopoverDescription } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import Popover from '../popover/popover'

export function AscentsQRDot({
  ascents,
}: {
  ascents?: Ascent[]
}) {
  if (ascents === undefined || ascents[0] === undefined) return <span />

  const hardestAscent = useMemo(() => getHardestAscent(ascents), [ascents])

  return (
    <Popover
      triggerClassName={fromGradeToClassName(hardestAscent?.topoGrade)}
      triggerContent=""
      popoverDescription={<AscentsInDayPopoverDescription ascents={ascents} />}
      popoverTitle={formatDateInTooltip(ascents[0]?.date)}
    />
  )
}
