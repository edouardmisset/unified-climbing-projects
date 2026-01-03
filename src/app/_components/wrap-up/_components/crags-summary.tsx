import { objectKeys } from '@edouardmisset/object'
import { frequencyBy } from '~/helpers/frequency-by'
import { compareStringsAscending } from '~/helpers/sort-strings'
import type { AscentListProps } from '~/schema/ascent'
import {
  OUTDOOR,
  SESSION_TYPE,
  type TrainingSessionListProps,
} from '~/schema/training'
import ascentsWithPopoverStyles from '../../ascents-with-popover/ascents-with-popover.module.css'
import { Card } from '../../card/card'
import { Popover } from '../../popover/popover'

const INDOOR_SESSION_TYPES = Object.entries(SESSION_TYPE)
  .filter(
    ([_, value]) =>
      value.category !== 'outdoor' && value.category !== 'otherTraining',
  )
  .map(([key]) => key) as (keyof typeof SESSION_TYPE)[]

export function CragsSummary({
  ascents,
  trainingSessions,
}: AscentListProps & TrainingSessionListProps) {
  const cragsByFrequency = frequencyBy(ascents, 'crag', { ascending: false })
  const crags = objectKeys(cragsByFrequency)
  const [mostFrequentCrag] = crags
  const numberOfCrags = crags.length

  const cragsWithAscents = new Set(crags)
  const cragsWithTrainingSessions = new Set(
    trainingSessions
      .filter(({ type }) => type === OUTDOOR)
      .map(({ location = '' }) => location),
  )
  const cragsWithoutAscents = [...cragsWithTrainingSessions].filter(
    crag => crag.trim() !== '' && !cragsWithAscents.has(crag),
  )

  const numberOfSessionsIndoor = trainingSessions.filter(({ type }) =>
    type === undefined ? false : INDOOR_SESSION_TYPES.includes(type),
  ).length

  if (
    numberOfCrags === 0 ||
    mostFrequentCrag === undefined ||
    mostFrequentCrag === ''
  )
    return

  return (
    <Card>
      <h2>Crags</h2>
      <p>
        You visited{' '}
        <Popover
          popoverDescription={
            <ul className={ascentsWithPopoverStyles.list}>
              {crags.toSorted(compareStringsAscending).map(crag => (
                <li className={ascentsWithPopoverStyles.item} key={crag}>
                  {crag}
                </li>
              ))}
            </ul>
          }
          popoverTitle="Crags"
          triggerClassName={ascentsWithPopoverStyles.popover}
          triggerContent={
            <span>
              <strong>{numberOfCrags}</strong> crags
            </span>
          }
        />{' '}
        and you went to <strong>{mostFrequentCrag}</strong> the most.
        {cragsWithoutAscents.length > 0 && (
          <>
            <br />
            Crags without ascents:{' '}
            <Popover
              popoverDescription={
                <ul className={ascentsWithPopoverStyles.list}>
                  {cragsWithoutAscents.map(crag => (
                    <li className={ascentsWithPopoverStyles.item} key={crag}>
                      {crag}
                    </li>
                  ))}
                </ul>
              }
              popoverTitle="Crags without ascents"
              triggerClassName={ascentsWithPopoverStyles.popover}
              triggerContent={
                <span>
                  <strong>{cragsWithoutAscents.length}</strong> crags
                </span>
              }
            />
          </>
        )}
        {numberOfSessionsIndoor > 0 && (
          <>
            <br />
            Indoor sessions: <strong>{numberOfSessionsIndoor}</strong>
          </>
        )}
      </p>
    </Card>
  )
}
