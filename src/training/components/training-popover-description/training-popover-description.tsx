import { wrapInParentheses } from '@edouardmisset/text'
import {
  formatComments,
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/shared/helpers/formatters'
import { roundToTen } from '~/shared/helpers/math'
import { formatWholePercent } from '~/shared/helpers/number-formatter'
import { fromSessionTypeToLabel, type TrainingSessionListProps } from '~/training/schema'
import styles from './training-popover-description.module.css'

export function TrainingPopoverDescription({ trainingSessions }: TrainingSessionListProps) {
  if (trainingSessions.length === 0 || trainingSessions[0] === undefined) return

  return (
    <ul className={styles.list}>
      {trainingSessions.map(
        ({
          anatomicalRegion,
          climbingDiscipline,
          comments,
          energySystem,
          gymCrag,
          intensity,
          load,
          sessionType,
          volume,
          _id,
        }) => (
          <li className={styles.item} key={_id}>
            {climbingDiscipline === undefined ? (
              ''
            ) : (
              <span title={climbingDiscipline}>
                {fromClimbingDisciplineToEmoji(climbingDiscipline)}
              </span>
            )}{' '}
            {gymCrag}{' '}
            {sessionType ? (
              <span title={fromSessionTypeToLabel(sessionType)}>
                {wrapInParentheses(fromSessionTypeToLabel(sessionType))}
              </span>
            ) : (
              ''
            )}{' '}
            {volume === undefined ? '' : `Volume: ${formatWholePercent(volume)}`}{' '}
            {intensity === undefined ? '' : `Intensity: ${formatWholePercent(intensity)}`}{' '}
            {load === undefined ? '' : `Load: ${formatWholePercent(roundToTen(load))}`}{' '}
            {anatomicalRegion === undefined
              ? ''
              : `| ${fromAnatomicalRegionToEmoji(anatomicalRegion)}`}{' '}
            {energySystem === undefined ? '' : `| ${fromEnergySystemToEmoji(energySystem)}`}{' '}
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
