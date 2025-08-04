import { memo, useMemo } from 'react'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/ascent-converter'
import { getWeekNumber } from '~/helpers/date'
import { sortByGrade } from '~/helpers/sorter'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import { AscentsPopoverDescription } from '../ascents-popover-description/ascents-popover-description'
import { Popover } from '../popover/popover'
import styles from './barcode.module.css'

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

  if (weeklyAscentsByDescendingGrade[0] === undefined) return <span />

  const title = `${weeklyAscentsByDescendingGrade.length} ascents in week # ${getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date))}`
  const triggerClassName = `${
    isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
  } ${styles.bar}`

  return (
    <Popover
      buttonStyle={buttonStyle}
      popoverDescription={
        <AscentsPopoverDescription
          ascents={weeklyAscentsByDescendingGrade}
          showCrag
        />
      }
      popoverTitle={title}
      triggerClassName={triggerClassName}
      triggerContent=""
    />
  )
})

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}
