import { lazy, memo, Suspense, useMemo } from 'react'
import { fromGradeToClassName } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { Popover } from '../popover/popover'

// Lazy load the popover component
const AscentsPopoverDescription = lazy(() =>
  import('../ascents-popover-description/ascents-popover-description').then(
    module => ({ default: module.AscentsPopoverDescription }),
  ),
)

export const AscentsQRDot = memo(({ ascents }: { ascents?: Ascent[] }) => {
  const [firstAscent] = ascents ?? []
  const hardestAscent = useMemo(
    () => (ascents === undefined ? undefined : getHardestAscent(ascents)),
    [ascents],
  )

  const gradeClassName = useMemo(
    () => fromGradeToClassName(hardestAscent?.grade),
    [hardestAscent],
  )

  const dateAndCrag = useMemo(
    () =>
      firstAscent?.date === undefined
        ? ''
        : `${prettyLongDate(firstAscent.date)} - ${firstAscent.crag}`,
    [firstAscent],
  )

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = useMemo(() => {
    if (!ascents || ascents.length === 0) return ''
    return (
      <Suspense fallback="Loading...">
        <AscentsPopoverDescription ascents={ascents} />
      </Suspense>
    )
  }, [ascents])

  if (ascents === undefined || firstAscent === undefined) return <span />

  return (
    <Popover
      popoverDescription={lazyDescription}
      popoverTitle={dateAndCrag}
      triggerClassName={gradeClassName}
      triggerContent=""
    />
  )
})
