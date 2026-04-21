import { lazy, memo, Suspense, useMemo } from 'react'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/ascents/helpers/ascent-converter'
import { getWeekNumber } from '~/shared/helpers/date'
import { formatCountWithEnglishNoun } from '~/shared/helpers/format-plurals'
import { formatNumber } from '~/shared/helpers/number-formatter'
import { sortByGrade } from '~/shared/helpers/sorter'
import type { Ascent } from '~/ascents/schema'
import type { StringDate } from '~/shared/types'
import { Popover } from '../ui/popover/popover'
import styles from './barcode.module.css'

// Lazy load the popover component
const AscentsPopoverDescription = lazy(async () =>
  import('~/ascents/components/ascents-popover-description/ascents-popover-description').then(
    module => ({
      default: module.AscentsPopoverDescription,
    }),
  ),
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

  const title = `${formatCountWithEnglishNoun(weeklyAscentsByDescendingGrade.length, {
    one: 'ascent',
    other: 'ascents',
  })} in week # ${formatNumber(getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date)), {
    useGrouping: false,
  })}`
  const triggerClassName = `${
    isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
  } ${styles.bar}`

  return (
    <Popover className={triggerClassName} popoverTitle={title} style={buttonStyle} trigger=''>
      {lazyDescription}
    </Popover>
  )
})

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}
