import type {
  TrainingSession,
  TrainingSessionListProps,
} from '~/schema/training'
import { Card } from '../../card/card'

const INDOOR_SESSION_TYPES = [
  'CS',
  'En',
  'MS',
  'PE',
  'Po',
  'SE',
  'Sk',
  'St',
  'Ta',
] as const satisfies TrainingSession['sessionType'][]

export function TrainingSummary({
  trainingSessions,
}: TrainingSessionListProps) {
  const numberOfIndoorSessions = trainingSessions.filter(({ sessionType }) =>
    sessionType === undefined
      ? false
      : INDOOR_SESSION_TYPES.includes(sessionType),
  ).length

  const numberOfOutdoorSessions = trainingSessions.filter(
    ({ sessionType }) => sessionType === 'Out',
  ).length

  const totalSessions = numberOfIndoorSessions + numberOfOutdoorSessions

  const indoorOutdoorRatio =
    numberOfOutdoorSessions === 0
      ? 'N/A'
      : (numberOfIndoorSessions / numberOfOutdoorSessions).toFixed(2)

  const numberOfRouteSessions = trainingSessions.filter(
    ({ climbingDiscipline }) => climbingDiscipline === 'Route',
  ).length

  const numberOfBoulderSessions = trainingSessions.filter(
    ({ climbingDiscipline }) => climbingDiscipline === 'Boulder',
  ).length

  const routeBoulderRatio =
    numberOfBoulderSessions === 0
      ? 'N/A'
      : (numberOfRouteSessions / numberOfBoulderSessions).toFixed(2)

  if (totalSessions === 0) return

  return (
    <Card>
      <h2>Training</h2>
      <p>
        Number of indoor training sessions:{' '}
        <strong>{numberOfIndoorSessions}</strong>
        <br />
        Number of outdoor sessions: <strong>{numberOfOutdoorSessions}</strong>
        <br />
        Ratio: <strong>{indoorOutdoorRatio}</strong>
        {(numberOfRouteSessions > 0 || numberOfBoulderSessions > 0) && (
          <>
            <br />
            Route vs Boulder ratio: <strong>{routeBoulderRatio}</strong>
          </>
        )}
      </p>
    </Card>
  )
}
