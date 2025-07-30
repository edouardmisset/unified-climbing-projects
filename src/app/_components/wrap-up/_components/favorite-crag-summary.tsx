import { getCragsDetails } from '~/helpers/filter-ascents'
import type { AscentListProps } from '~/schema/ascent'
import ascentsWithPopoverStyles from '../../ascents-with-popover/ascents-with-popover.module.css'
import { Card } from '../../card/card'
import { Popover } from '../../popover/popover'

export function FavoriteCragSummary({ ascents }: AscentListProps) {
  const { numberOfCrags, mostFrequentCrag, crags } = getCragsDetails(ascents)

  if (
    numberOfCrags === 0 ||
    mostFrequentCrag === undefined ||
    mostFrequentCrag === ''
  )
    return undefined

  return (
    <Card>
      <h2>Favorite Crag</h2>
      <p>
        You visited{' '}
        <Popover
          popoverDescription={
            <ul className={ascentsWithPopoverStyles.list}>
              {crags.map(crag => (
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
        and you went to <strong>{mostFrequentCrag}</strong> the most
      </p>
    </Card>
  )
}
