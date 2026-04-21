import { objectKeys } from '@edouardmisset/object'
import { frequencyBy } from '~/shared/helpers/frequency-by'
import { compareStringsAscending } from '~/shared/helpers/sort-strings'
import type { AscentListProps } from '~/ascents/schema'
import type { TrainingSessionListProps } from '~/training/schema'
import ascentsWithPopoverStyles from '~/ascents/components/ascents-with-popover/ascents-with-popover.module.css'
import { Card } from '~/shared/components/ui/card/card'
import { Popover } from '~/shared/components/ui/popover/popover'

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
    crag => crag.trim() !== '' && !cragsWithAscents.has(crag),
  )

  if (numberOfCrags === 0 || mostFrequentCrag === undefined || mostFrequentCrag === '') return

  return (
    <Card>
      <h2>Crags</h2>
      <p>
        You visited{' '}
        <Popover
          className={ascentsWithPopoverStyles.popover}
          popoverTitle='Crags'
          trigger={
            <span>
              <strong>{numberOfCrags}</strong> crags
            </span>
          }
        >
          <ul className={ascentsWithPopoverStyles.list}>
            {crags.toSorted(compareStringsAscending).map(crag => (
              <li className={ascentsWithPopoverStyles.item} key={crag}>
                {crag}
              </li>
            ))}
          </ul>
        </Popover>{' '}
        and you went to <strong>{mostFrequentCrag}</strong> the most.
        {cragsWithoutAscents.length > 0 && (
          <>
            <br />
            Crags without ascents:{' '}
            <Popover
              className={ascentsWithPopoverStyles.popover}
              popoverTitle='Crags without ascents'
              trigger={
                <span>
                  <strong>{cragsWithoutAscents.length}</strong> crags
                </span>
              }
            >
              <ul className={ascentsWithPopoverStyles.list}>
                {cragsWithoutAscents.map(crag => (
                  <li className={ascentsWithPopoverStyles.item} key={crag}>
                    {crag}
                  </li>
                ))}
              </ul>
            </Popover>
          </>
        )}
      </p>
    </Card>
  )
}
