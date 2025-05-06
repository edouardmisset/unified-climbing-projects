import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'

import { displayGrade } from '~/helpers/display-grade'
import styles from './ascents-popover-description.module.css'

export function AscentsPopoverDescription({
  ascents,
  showCrag = false,
}: { ascents?: Ascent[]; showCrag?: boolean }) {
  if (ascents === undefined || ascents[0] === undefined) return ''

  return (
    <ul className={styles.list}>
      {ascents.map(({ routeName, topoGrade, climbingDiscipline, crag }) => (
        <li
          key={routeName}
          style={{
            paddingInlineStart: 0,
          }}
          className={styles.item}
        >
          {fromClimbingDisciplineToEmoji(climbingDiscipline)} {routeName} (
          <strong>
            {displayGrade({ grade: topoGrade, climbingDiscipline })}
          </strong>
          ) {showCrag ? `- ${crag}` : ''}
        </li>
      ))}
    </ul>
  )
}
