import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'

import styles from './ascents-popover-description.module.css'

export function AscentsPopoverDescription({ ascents }: { ascents?: Ascent[] }) {
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
          <strong>{topoGrade}</strong>) - {crag}
        </li>
      ))}
    </ul>
  )
}
