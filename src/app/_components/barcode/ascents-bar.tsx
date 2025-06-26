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

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}

export const AscentsBar = memo(({ weeklyAscents }: AscentsBarsProps) => {
  const numberOfAscents = weeklyAscents.length

  const weeklyAscentsByDescendingGrade = useMemo(
    () =>
      weeklyAscents
        .filter(ascent => ascent !== undefined)
        .sort((a, b) => sortByGrade(a, b)),
    [weeklyAscents],
  )

  const isSingleAscent = weeklyAscents.length <= 1

  if (weeklyAscentsByDescendingGrade[0] === undefined) return <span />

  return (
    <Popover
      buttonStyle={{
        background: isSingleAscent
          ? undefined
          : `linear-gradient(to bottom in oklch, ${weeklyAscentsByDescendingGrade
              .map(({ topoGrade }) => fromGradeToBackgroundColor(topoGrade))
              .join(', ')})`,
        inlineSize: `${numberOfAscents / 2}%`,
      }}
      popoverDescription={
        <AscentsPopoverDescription
          ascents={weeklyAscentsByDescendingGrade}
          showCrag={true}
        />
      }
      popoverTitle={`${weeklyAscentsByDescendingGrade.length} ascents in week # ${getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date))}`}
      triggerClassName={`${
        isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
      } ${styles.bar}`}
      triggerContent=""
    />
  )
})
