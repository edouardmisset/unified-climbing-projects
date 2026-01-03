import { stringifyDate } from '@edouardmisset/date'
import { NON_BREAKING_SPACE } from '~/constants/generic'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { TrainingSession } from '~/schema/training'
import styles from './training-summary.module.css'

export function SessionList({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <ul className={styles.list}>
      {sessions.map(({ climbingDiscipline, date, gymCrag }, index) => (
        <li className={styles.item} key={index}>
          {(climbingDiscipline
            ? fromClimbingDisciplineToEmoji(climbingDiscipline)
            : '―') + NON_BREAKING_SPACE}
          {<span className="monospace">{stringifyDate(new Date(date))}</span>}
          {gymCrag ? ` - ${gymCrag}` : ''}
        </li>
      ))}
    </ul>
  )
}
