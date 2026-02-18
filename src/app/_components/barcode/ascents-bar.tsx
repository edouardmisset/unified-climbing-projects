import { lazy, memo, Suspense, useMemo } from 'react'
import { fromGradeToBackgroundColor, fromGradeToClassName } from '~/helpers/ascent-converter'
import { getWeekNumber } from '~/helpers/date'
import { sortByGrade } from '~/helpers/sorter'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import { Popover } from '../popover/popover'
import styles from './barcode.module.css'

// Lazy load the popover component
const AscentsPopoverDescription = lazy(async () =>
  import('../ascents-popover-description/ascents-popover-description').then(module => ({
    default: module.AscentsPopoverDescription,
  })),
)

export const AscentsBar = memo(({ weeklyAscents }: AscentsBarsProps) => {
  const numberOfAscents = weeklyAscents.length
  const isSingleAscent = numberOfAscents <= 1

  const weeklyAscentsByDescendingGrade = useMemo(
    () => weeklyAscents.filter(Boolean).sort(sortByGrade),
    [weeklyAscents],
  )

  const buttonStyle = useMemo(
    () => ({
      background: isSingleAscent
        ? undefined
        : `linear-gradient(to bottom in oklch, ${weeklyAscentsByDescendingGrade
            .map(({ topoGrade }) => fromGradeToBackgroundColor(topoGrade))
            .join(', ')})`,
      inlineSize: `${numberOfAscents / 2}%`,
    }),
    [isSingleAscent, weeklyAscentsByDescendingGrade, numberOfAscents],
  )

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = useMemo(() => {
    if (weeklyAscentsByDescendingGrade.length === 0) return ''
    return (
      <Suspense fallback='Loading...'>
        <AscentsPopoverDescription ascents={weeklyAscentsByDescendingGrade} showCrag />
      </Suspense>
    )
  }, [weeklyAscentsByDescendingGrade])

  if (weeklyAscentsByDescendingGrade[0] === undefined) return <span />

  const title = `${weeklyAscentsByDescendingGrade.length} ascents in week # ${getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date))}`
  const triggerClassName = `${
    isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
  } ${styles.bar}`

  return (
    <Popover
      buttonStyle={buttonStyle}
      popoverDescription={lazyDescription}
      popoverTitle={title}
      triggerClassName={triggerClassName}
      triggerContent=''
    />
  )
})

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}
