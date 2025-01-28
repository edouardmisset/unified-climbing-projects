import {
  fromGradeToBackgroundColor,
  fromGradeToClassName,
} from '~/helpers/converter'
import { sortByDescendingGrade } from '~/helpers/sorter'
import { createAscentBarCodeTooltip } from '~/helpers/tooltips'
import type { Ascent } from '~/schema/ascent'
import type { StringDateTime } from '~/types/generic'

import styles from '~/app/_components/barcode/barcode.module.css'

export function ascentsBarcodeRender(
  weeklyAscents: ((StringDateTime & Ascent) | undefined)[],
  index: number,
) {
  const numberOfAscents = weeklyAscents.length

  const weeklyAscentsByDescendingGrade = weeklyAscents
    .filter(ascent => ascent !== undefined)
    .sort((a, b) => sortByDescendingGrade(a, b))

  const isSingleAscent = weeklyAscents.length <= 1

  return (
    <span
      key={(weeklyAscents[0]?.date ?? index).toString()}
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
