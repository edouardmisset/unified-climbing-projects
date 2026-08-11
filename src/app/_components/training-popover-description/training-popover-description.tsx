import { wrapInParentheses } from '@edouardmisset/text'
import { useQuery } from '@tanstack/react-query'
import { getTrainingSessionComments } from '~/app/training-sessions/actions'
import { calculateLoad } from '~/helpers/calculate-load'
import {
  formatComments,
  fromAnatomicalRegionToEmoji,
  fromClimbingDisciplineToEmoji,
  fromEnergySystemToEmoji,
} from '~/helpers/formatters'
import { roundToTen } from '~/helpers/math'
import { formatWholePercent } from '~/helpers/number-formatter'
import type { TrainingSessionListProps } from '~/schema/training'
import styles from './training-popover-description.module.css'

export function TrainingPopoverDescription({ trainingSessions }: TrainingSessionListProps) {
  const singleSession = trainingSessions.length === 1 ? trainingSessions[0] : undefined
  const commentsQuery = useQuery({
    enabled: singleSession !== undefined,
    queryFn: () =>
      singleSession === undefined
        ? Promise.resolve('')
        : getTrainingSessionComments(singleSession._id),
    queryKey: ['training-session-comments', singleSession?._id],
    staleTime: 60_000,
  })

  if (trainingSessions.length === 0 || trainingSessions[0] === undefined) return

  const isSingleSession = singleSession !== undefined

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
              {isSingleSession && commentsQuery.data !== undefined && commentsQuery.data !== '' ? (
                <div title={commentsQuery.data}>{formatComments(commentsQuery.data)}</div>
              ) : (
                ''
              )}
            </li>
          )
        },
      )}
    </ul>
  )
}
