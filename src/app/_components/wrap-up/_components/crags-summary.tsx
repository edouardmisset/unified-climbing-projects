import { objectKeys } from '@edouardmisset/object'
import { frequencyBy } from '~/helpers/frequency-by'
import type { AscentListProps } from '~/schema/ascent'
import type { TrainingSessionListProps } from '~/schema/training'
import ascentsWithPopoverStyles from '../../ascents-with-popover/ascents-with-popover.module.css'
import { Card } from '../../card/card'
import { Popover } from '../../popover/popover'

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
      .filter(({ sessionType }) => sessionType === 'Out')
      .map(({ gymCrag = '' }) => gymCrag),
  )
  const cragsWithoutAscents = [...cragsWithTrainingSessions].filter(
    crag => !cragsWithAscents.has(crag),
  )

  if (
    numberOfCrags === 0 ||
    mostFrequentCrag === undefined ||
    mostFrequentCrag === ''
  )
    return undefined

  return (
    <Card>
      <h2>Crags</h2>
      <p>
        You visited{' '}
        <Popover
          popoverDescription={
            <ul className={ascentsWithPopoverStyles.list}>
              {crags.toSorted().map(crag => (
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
      </p>
    </Card>
  )
}
