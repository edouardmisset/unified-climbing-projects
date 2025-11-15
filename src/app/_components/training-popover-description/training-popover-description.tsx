import { wrapInParentheses } from '@edouardmisset/text'
import {
  formatComments,
  fromClimbingDisciplineToEmoji,
} from '~/helpers/formatters'
import {
  ANATOMICAL_REGION,
  ENERGY_SYSTEM,
  type TrainingSessionListProps,
} from '~/schema/training'
import styles from './training-popover-description.module.css'

export function TrainingPopoverDescription({
  trainingSessions,
}: TrainingSessionListProps) {
  if (trainingSessions.length === 0 || trainingSessions[0] === undefined)
    return undefined

  return (
    <ul className={styles.list}>
      {trainingSessions.map(
        ({
          anatomicalRegion,
          discipline,
          comments,
          energySystem,
          location,
          intensity,
          type,
          volume,
          _id,
        }) => (
          <li className={styles.item} key={_id}>
            {discipline === undefined ? (
              ''
            ) : (
              <span title={discipline}>
                {fromClimbingDisciplineToEmoji(discipline)}
              </span>
            )}{' '}
            {location}{' '}
            {type ? <span title={type}>{wrapInParentheses(type)}</span> : ''}{' '}
            {volume === undefined ? '' : `Volume: ${volume}%`}{' '}
            {intensity === undefined ? '' : `Intensity: ${intensity}%`}{' '}
            {anatomicalRegion === undefined
              ? ''
              : `| ${ANATOMICAL_REGION[anatomicalRegion].emoji}`}{' '}
            {energySystem === undefined
              ? ''
              : `| ${ENERGY_SYSTEM[energySystem].emoji}`}{' '}
            {comments === undefined || trainingSessions.length > 1 ? (
              ''
            ) : (
              <div title={comments}>{formatComments(comments)}</div>
            )}
          </li>
        ),
      )}
    </ul>
  )
}
