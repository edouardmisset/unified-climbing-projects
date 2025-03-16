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
    const [firstAscent] = ascents ?? []
    if (ascents === undefined || firstAscent === undefined) return <span />
    const hardestAscent = useMemo(() => getHardestAscent(ascents), [ascents])

    const gradeClassName = useMemo(
      () => fromGradeToClassName(hardestAscent?.topoGrade),
      [hardestAscent],
    )

    const formattedAscentDate = useMemo(
      () =>
        firstAscent.date === undefined
          ? ''
          : formatDateInTooltip(firstAscent.date),
      [firstAscent],
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
