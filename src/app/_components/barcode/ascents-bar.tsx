import { memo, useMemo } from 'react'
import { getWeekNumber } from '~/helpers/date'
import { sortByDescendingGrade } from '~/helpers/sorter'
import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/training-converter'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import { AscentsPopoverDescription } from '../ascents-popover-description/ascents-popover-description'
import { Popover } from '../popover/popover'
import styles from './barcode.module.css'

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}

export const AscentsBar = memo(({ weeklyAscents }: AscentsBarsProps) => {
  const numberOfAscents = weeklyAscents.length

  const weeklyAscentsByDescendingGrade = useMemo(
    () =>
      weeklyAscents
        .filter(ascent => ascent !== undefined)
        .sort((a, b) => sortByDescendingGrade(a, b)),
    [weeklyAscents],
  )

  const isSingleAscent = weeklyAscents.length <= 1

  if (weeklyAscentsByDescendingGrade[0] === undefined) return <span />

  return (
    <Popover
      triggerClassName={`${
        isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
      } ${styles.bar}`}
      buttonStyle={{
        inlineSize: `${numberOfAscents / 2}%`,
        background: isSingleAscent
          ? undefined
          : `linear-gradient(to bottom in oklch, ${weeklyAscentsByDescendingGrade
              .map(({ topoGrade }) => fromGradeToBackgroundColor(topoGrade))
              .join(', ')})`,
      }}
      triggerContent=""
      popoverDescription={
        <AscentsPopoverDescription
          ascents={weeklyAscentsByDescendingGrade}
          showCrag={true}
        />
      }
      popoverTitle={`${weeklyAscentsByDescendingGrade.length} ascents in week # ${getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date))}`}
    />
  )
})
