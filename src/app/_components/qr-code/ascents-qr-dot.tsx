import { memo, useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { AscentsPopoverDescription } from '../ascents-popover-description/ascents-popover-description'
import { Popover } from '../popover/popover'

export const AscentsQRDot = memo(
  ({
    ascents,
  }: {
    ascents?: Ascent[]
  }) => {
    const [firstAscent] = ascents ?? []
    const hardestAscent = useMemo(
      () => (ascents === undefined ? undefined : getHardestAscent(ascents)),
      [ascents],
    )

    const gradeClassName = useMemo(
      () => fromGradeToClassName(hardestAscent?.topoGrade),
      [hardestAscent],
    )

    const dateAndCrag = useMemo(
      () =>
        firstAscent?.date === undefined
          ? ''
          : `${prettyLongDate(firstAscent.date)} - ${firstAscent.crag}`,
      [firstAscent],
    )

    if (ascents === undefined || firstAscent === undefined) return <span />

    return (
      <Popover
        triggerClassName={gradeClassName}
        triggerContent=""
        popoverDescription={<AscentsPopoverDescription ascents={ascents} />}
        popoverTitle={dateAndCrag}
      />
    )
  },
)
