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

export const AscentsQRDot = ({ ascents }: { ascents?: Ascent[] }) => {
  const [firstAscent] = ascents ?? []
  const hardestAscent = (ascents === undefined ? undefined : getHardestAscent(ascents))

  const gradeClassName = fromGradeToClassName(hardestAscent?.grade)

  const dateAndCrag = firstAscent?.date === undefined
        ? ''
        : `${prettyLongDate(firstAscent.date)} - ${firstAscent.crag}`

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = (() => {
    if (!ascents || ascents.length === 0) return ''
    return (
      <Suspense fallback='Loading...'>
        <AscentsPopoverDescription ascents={ascents} />
      </Suspense>
    )
  })()

  if (ascents === undefined || firstAscent === undefined) return <span />

  return (
    <Popover
      aria-label={`Ascent on ${dateAndCrag}`}
      className={gradeClassName}
      popoverTitle={dateAndCrag}
      trigger=''
    >
      {lazyDescription}
    </Popover>
  )
}
