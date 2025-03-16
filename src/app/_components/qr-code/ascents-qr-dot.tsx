import { memo, useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { formatDateInTooltip } from '~/helpers/formatters'
import { AscentsInDayPopoverDescription } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import { Popover } from '../popover/popover'

export const AscentsQRDot = memo(
  ({
    ascents,
  }: {
    ascents?: Ascent[]
  }) => {
    if (ascents === undefined || ascents[0] === undefined) return <span />
    const hardestAscent = useMemo(() => getHardestAscent(ascents), [ascents])

    const gradeClassName = useMemo(
      () => fromGradeToClassName(hardestAscent?.topoGrade),
      [hardestAscent],
    )

    const formattedAscentDate = useMemo(
      () =>
        ascents?.[0]?.date === undefined
          ? ''
          : formatDateInTooltip(ascents[0].date),
      [ascents],
    )

    return (
      <Popover
        triggerClassName={gradeClassName}
        triggerContent=""
        popoverDescription={
          <AscentsInDayPopoverDescription ascents={ascents} />
        }
        popoverTitle={formattedAscentDate}
      />
    )
  },
)
