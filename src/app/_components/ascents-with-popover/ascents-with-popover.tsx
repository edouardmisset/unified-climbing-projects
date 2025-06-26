import { capitalize, wrapInParentheses } from '@edouardmisset/text'
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
  const ascentsDisciplineText = writeAscentsDisciplineText(ascents)
  return (
    <Popover
      popoverDescription={
        <div className={styles.popoverContainer}>
          {ascents.map(({ id, routeName, topoGrade, climbingDiscipline }) => (
            <span
              key={id}
            >{`${routeName} ${wrapInParentheses(displayGrade({ climbingDiscipline, grade: topoGrade }))}`}</span>
          ))}
        </div>
      }
      popoverTitle={capitalize(ascentsDisciplineText)}
      triggerClassName={styles.popover}
      triggerContent={
        <span>
          <strong>{ascents.length}</strong> {ascentsDisciplineText}
        </span>
      }
    />
  )
}
