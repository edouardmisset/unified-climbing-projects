import { capitalize } from '@edouardmisset/text'
import { useMemo } from 'react'
import { writeAscentsDisciplineText } from '~/helpers/write-ascents-discipline-text'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
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
          <span key={id}>
            {routeName} (
            <DisplayGrade
              climbingDiscipline={climbingDiscipline}
              grade={topoGrade}
            />
            )
          </span>
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
