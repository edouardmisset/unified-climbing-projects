import { stringifyDate } from '@edouardmisset/date'
import { NON_BREAKING_SPACE } from '~/constants/generic'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { TrainingSession } from '~/schema/training'
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
            <span className='monospace'>{stringifyDate(new Date(date))}</span>
            {gymCrag && ` - ${gymCrag}`}
          </li>
        )
      })}
    </ul>
  )
}
