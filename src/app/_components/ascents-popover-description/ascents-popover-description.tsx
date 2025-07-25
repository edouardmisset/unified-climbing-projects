import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './ascents-popover-description.module.css'

export function AscentsPopoverDescription({
  ascents,
  showCrag = false,
}: {
  ascents?: Ascent[]
  showCrag?: boolean
}) {
  if (ascents === undefined || ascents[0] === undefined) return ''

  return (
    <ul className={styles.list}>
      {ascents.map(({ routeName, topoGrade, climbingDiscipline, crag }) => (
        <li
          className={styles.item}
          key={routeName}
          style={{
            paddingInlineStart: 0,
          }}
        >
          {fromClimbingDisciplineToEmoji(climbingDiscipline)} {routeName} (
          <DisplayGrade
            climbingDiscipline={climbingDiscipline}
            grade={topoGrade}
          />
          ) {showCrag ? `- ${crag}` : ''}
        </li>
      ))}
    </ul>
  )
}
