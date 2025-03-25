import { addParenthesis } from '~/helpers/add-parenthesis'
import {
  formatComments,
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/helpers/formatters'
import { roundToTen } from '~/helpers/math'
import { type TrainingSession, fromSessionTypeToLabel } from '~/schema/training'
import styles from './training-popover-description.module.css'

export function TrainingPopoverDescription({
  trainingSessions,
}: { trainingSessions: TrainingSession[] }) {
  if (trainingSessions.length === 0 || trainingSessions[0] === undefined)
    return undefined

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
          id,
        }) => (
          <li key={id} className={styles.item}>
            {climbingDiscipline === undefined ? (
              ''
            ) : (
              <span title={climbingDiscipline}>
                {fromClimbingDisciplineToEmoji(climbingDiscipline)}
              </span>
            )}{' '}
            {gymCrag}{' '}
            {sessionType ? (
              <span
                title={fromSessionTypeToLabel(sessionType)}
                aria-label={fromSessionTypeToLabel(sessionType)}
              >
                {addParenthesis(fromSessionTypeToLabel(sessionType))}
              </span>
            ) : (
              ''
            )}{' '}
            {volume === undefined ? '' : `Volume: ${volume}%`}{' '}
            {intensity === undefined ? '' : `Intensity: ${intensity}%`}{' '}
            {load === undefined ? '' : `Load: ${roundToTen(load)}%`}{' '}
            {anatomicalRegion === undefined
              ? ''
              : `| ${fromAnatomicalRegionToEmoji(anatomicalRegion)}`}{' '}
            {energySystem === undefined
              ? ''
              : `| ${fromEnergySystemToEmoji(energySystem)}`}{' '}
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
