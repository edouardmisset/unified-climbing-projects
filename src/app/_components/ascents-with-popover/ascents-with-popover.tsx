import { capitalize, wrapInParentheses } from '@edouardmisset/text'
import { useMemo } from 'react'
import { displayGrade } from '~/helpers/display-grade'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent } from '~/schema/ascent'
import { Popover } from '../popover/popover'
import styles from './ascents-with-popover.module.css'

export function AscentsWithPopover({
  ascents,
}: {
  ascents: Ascent[]
}): React.JSX.Element {
  const ascentsDisciplineText = useMemo(
    () => writeAscentsDisciplineText(ascents),
    [ascents],
  )

  const text = useMemo(
    () => `${ascents.length} ${ascentsDisciplineText}`,
    [ascents.length, ascentsDisciplineText],
  )
  const title = useMemo(
    () => capitalize(ascentsDisciplineText),
    [ascentsDisciplineText],
  )

  const ascentsList = useMemo(
    () => (
      <div className={styles.popoverContainer}>
        {ascents.map(({ id, routeName, topoGrade, climbingDiscipline }) => (
          <span
            key={id}
          >{`${routeName} ${wrapInParentheses(displayGrade({ climbingDiscipline, grade: topoGrade }))}`}</span>
        ))}
      </div>
    ),
    [ascents],
  )

  return (
    <Popover
      popoverDescription={ascentsList}
      popoverTitle={title}
      triggerClassName={styles.popover}
      triggerContent={<strong>{text}</strong>}
    />
  )
}
