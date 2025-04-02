import { getCragsDetails } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
import ascentsWithPopoverStyles from '../../ascents-with-popover/ascents-with-popover.module.css'
import { Card } from '../../card/card'
import { Popover } from '../../popover/popover'

export function FavoriteCragSummary({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const { numberOfCrags, mostFrequentCrag, crags } = getCragsDetails(ascents)

  if (numberOfCrags === 0) return undefined
  if (mostFrequentCrag === undefined) return undefined

  return (
    <Card>
      <h2>Favorite Crag</h2>
      <p>
        You visited{' '}
        <Popover
          triggerClassName={ascentsWithPopoverStyles.popover}
          popoverDescription={
            <div className={ascentsWithPopoverStyles.popoverContainer}>
              {crags.map(crag => (
                <span key={crag}>{crag}</span>
              ))}
            </div>
          }
          popoverTitle="Crags"
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
