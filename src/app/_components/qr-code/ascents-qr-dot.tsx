import { lazy, Suspense } from 'react'
import { fromGradeToClassName } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { Popover } from '../ui/popover/popover'

// Lazy load the popover component
const AscentsPopoverDescription = lazy(async () =>
  import('../ascents-popover-description/ascents-popover-description').then(module => ({
    default: module.AscentsPopoverDescription,
  })),
)

export function AscentsQRDot({ ascents }: { ascents?: Ascent[] }) {
  const [firstAscent] = ascents ?? []
  const hardestAscent = ascents === undefined ? undefined : getHardestAscent(ascents)

  const gradeClassName = fromGradeToClassName(hardestAscent?.grade)

  const dateAndCrag =
    firstAscent?.date === undefined
      ? ''
      : `${prettyLongDate(firstAscent.date)} - ${firstAscent.crag}`

  if (ascents === undefined || firstAscent === undefined) return <span />

  const lazyDescription = (
    <Suspense fallback='Loading...'>
      <AscentsPopoverDescription ascents={ascents} />
    </Suspense>
  )

  return (
    <Popover
      aria-label={`Ascent on ${dateAndCrag}`}
      className={gradeClassName}
      popoverTitle={dateAndCrag}
      showOnInterest
      trigger=''
    >
      {lazyDescription}
    </Popover>
  )
}
