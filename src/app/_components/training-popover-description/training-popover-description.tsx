import { wrapInParentheses } from '@edouardmisset/text'
import {
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/helpers/formatters'
import { calculateLoad } from '~/helpers/calculate-load'
import { roundToTen } from '~/helpers/math'
import { formatWholePercent } from '~/helpers/number-formatter'
import type { TrainingSessionListProps } from '~/schema/training'
import styles from './training-popover-description.module.css'
import { TrainingSessionComment } from './training-session-comment'

export function TrainingPopoverDescription({ trainingSessions }: TrainingSessionListProps) {
  if (trainingSessions.length === 0 || trainingSessions[0] === undefined) return

  return (
    <ul className={styles.list}>
      {trainingSessions.map(
        ({
          anatomicalRegion,
          discipline,
          energySystem,
          location,
          intensity,
          type,
          volume,
          _id,
        }) => {
          const load = calculateLoad(volume, intensity)

          return (
            <li className={styles.item} key={_id}>
              {discipline === undefined ? (
                ''
              ) : (
                <span title={discipline}>{fromClimbingDisciplineToEmoji(discipline)}</span>
              )}{' '}
              {location} <span title={type}>{wrapInParentheses(type)}</span>{' '}
              {volume === undefined ? '' : `Volume: ${formatWholePercent(volume)}`}{' '}
              {intensity === undefined ? '' : `Intensity: ${formatWholePercent(intensity)}`}{' '}
              {load === undefined ? '' : `Load: ${formatWholePercent(roundToTen(load))}`}{' '}
              {anatomicalRegion === undefined
                ? ''
                : `| ${fromAnatomicalRegionToEmoji(anatomicalRegion)}`}{' '}
              {energySystem === undefined ? '' : `| ${fromEnergySystemToEmoji(energySystem)}`}{' '}
              {trainingSessions.length === 1 ? <TrainingSessionComment id={_id} /> : ''}
            </li>
          )
        },
      )}
    </ul>
  )
}
