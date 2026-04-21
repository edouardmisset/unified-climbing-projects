import { NON_BREAKING_SPACE } from '~/shared/constants/generic'
import { formatShortDate, fromClimbingDisciplineToEmoji } from '~/shared/helpers/formatters'
import type { TrainingSession } from '~/training/schema'
import styles from './training-summary.module.css'

export function SessionList({ sessions }: { sessions: TrainingSession[] }) {
  return (
    <ul className={styles.list}>
      {sessions.map(({ _id, climbingDiscipline, date, gymCrag }) => {
        const disciplineIcon = climbingDiscipline
          ? fromClimbingDisciplineToEmoji(climbingDiscipline)
          : '―'

        return (
          <li className={styles.item} key={_id}>
            {disciplineIcon}
            {NON_BREAKING_SPACE}
            <span className='monospace'>{formatShortDate(date)}</span>
            {gymCrag && ` - ${gymCrag}`}
          </li>
        )
      })}
    </ul>
  )
}
