import { memo, useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/converter'
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
    if (ascents === undefined || firstAscent === undefined) return <span />
    const hardestAscent = useMemo(() => getHardestAscent(ascents), [ascents])

    const gradeClassName = useMemo(
      () => fromGradeToClassName(hardestAscent?.topoGrade),
      [hardestAscent],
    )

    const dateAndCrag = useMemo(
      () =>
        firstAscent.date === undefined
          ? ''
          : `${prettyLongDate(firstAscent.date)} - ${firstAscent.crag}`,
      [firstAscent],
    )

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
