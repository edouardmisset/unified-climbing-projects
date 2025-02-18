import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

import styles from './barcode.module.css'

type AscentsBarsProps = {
  weeklyAscents: ((StringDateTime & Ascent) | undefined)[]
}

export function AscentsBar({ weeklyAscents }: AscentsBarsProps) {
  const numberOfAscents = weeklyAscents.length

  const weeklyAscentsByDescendingGrade = weeklyAscents
    .filter(ascent => ascent !== undefined)
    .sort((a, b) => sortByDescendingGrade(a, b))

  const isSingleAscent = weeklyAscents.length <= 1

  return (
    <span
      className={`${
        isSingleAscent ? fromGradeToClassName(weeklyAscents[0]?.topoGrade) : ''
      } ${styles.bar}`}
      style={{
        inlineSize: `${numberOfAscents / 2}%`,
        background: isSingleAscent
          ? undefined
          : `linear-gradient(to bottom in oklch, ${weeklyAscentsByDescendingGrade
              .map(({ topoGrade }) => fromGradeToBackgroundColor(topoGrade))
              .join(', ')})`,
      }}
      title={createAscentBarCodeTooltip(weeklyAscentsByDescendingGrade)}
    />
  )
}
