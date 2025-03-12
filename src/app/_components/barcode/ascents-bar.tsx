import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/converter'
import { getWeekNumber } from '~/helpers/date'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { AscentInWeekDescription } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDate } from '~/types/generic'
import Popover from '../popover/popover'
import styles from './barcode.module.css'

type AscentsBarsProps = {
  weeklyAscents: ((StringDate & Ascent) | undefined)[]
}

export function AscentsBar({ weeklyAscents }: AscentsBarsProps) {
  const numberOfAscents = weeklyAscents.length

  const weeklyAscentsByDescendingGrade = weeklyAscents
    .filter(ascent => ascent !== undefined)
    .sort((a, b) => sortByDescendingGrade(a, b))

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
        <AscentInWeekDescription ascents={weeklyAscentsByDescendingGrade} />
      }
      popoverTitle={`${weeklyAscentsByDescendingGrade.length} ascents in week # ${getWeekNumber(new Date(weeklyAscentsByDescendingGrade[0].date))}`}
    />
  )
}
