import { lazy, Suspense } from 'react'
import { fromGradeToBackgroundColor, fromGradeToClassName } from '~/helpers/ascent-converter'
import { getWeekNumber } from '~/helpers/date'
import { formatCountWithEnglishNoun } from '~/helpers/format-plurals'
import { formatNumber } from '~/helpers/number-formatter'
import { sortByGrade } from '~/helpers/sorter'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import { Popover } from '../ui/popover/popover'
import styles from './barcode.module.css'

// Lazy load the popover component
const AscentsPopoverDescription = lazy(async () =>
  import('../ascents-popover-description/ascents-popover-description').then(module => ({
    default: module.AscentsPopoverDescription,
  })),
)

export const AscentsBar = ({ weeklyAscents }: AscentsBarsProps) => {
  const numberOfAscents = weeklyAscents.length
  const isSingleAscent = numberOfAscents <= 1

  const weeklyAscentsByDescendingGrade = weeklyAscents.filter(Boolean).sort(sortByGrade)

  const buttonStyle = ({
      background: isSingleAscent
        ? undefined
        : `linear-gradient(to bottom in oklch, ${weeklyAscentsByDescendingGrade
            .map(({ grade }) => fromGradeToBackgroundColor(grade))
            .join(', ')})`,
      inlineSize: `${numberOfAscents / 2}%`,
    })

  // LAZY LOADING: Create description component only when needed
  const lazyDescription = (() => {
    if (weeklyAscentsByDescendingGrade.length === 0) return ''
    return (
      <Suspense fallback='Loading...'>
        <AscentsPopoverDescription ascents={weeklyAscentsByDescendingGrade} showCrag />
      </Suspense>
    )
  })()

  if (weeklyAscentsByDescendingGrade[0] === undefined) return <span />

  const title = `${formatCountWithEnglishNoun(weeklyAscentsByDescendingGrade.length, {
    one: 'ascent',
    other: 'ascents',
  })} in week # ${formatNumber(getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date)), {
    useGrouping: false,
  })}`
  const triggerClassName = `${
    isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.grade) : ''
  } ${styles.bar}`

  return (
    <Popover className={triggerClassName} popoverTitle={title} style={buttonStyle} trigger=''>
      {lazyDescription}
    </Popover>
  )
}

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}
