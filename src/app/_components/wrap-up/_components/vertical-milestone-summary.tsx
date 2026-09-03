import { average } from '@edouardmisset/math'
import { DEFAULT_BOULDER_HEIGHT } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { formatUnit } from '~/helpers/number-formatter'
import type { AscentListProps } from '~/schema/ascent'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../ui/card/card'

export function VerticalMilestoneSummary({ ascents }: AscentListProps) {
  const boulders = filterAscents(ascents, { discipline: 'Bouldering' })
  const routes = filterAscents(ascents, { discipline: 'Sport' })

  if (boulders.length === 0 && routes.length === 0) return

  const totalHeight =
    routes.reduce((total, { height }) => total + (height ?? 0), 0) +
    boulders.reduce((total, { height }) => total + (height ?? DEFAULT_BOULDER_HEIGHT), 0)

  const averageHeight =
    routes.length > 0
      ? Math.round(average(...routes.map(({ height }) => height ?? 0)).data ?? 0)
      : 0

  const formattedTotalHeight = formatUnit(totalHeight, 'meter', { unitDisplay: 'long' })
  const formattedAverageHeight = formatUnit(averageHeight, 'meter', { unitDisplay: 'long' })

  return (
    <Card>
      <h2>Vertical Milestone</h2>
      <div>
        {routes.length > 0 && (
          <div>
            You climbed <AscentsWithPopover ascents={routes} />
          </div>
        )}
        {boulders.length > 0 && (
          <div>
            You climbed <AscentsWithPopover ascents={boulders} />
          </div>
        )}
        {totalHeight !== 0 && (
          <span className='block'>
            In total, you climbed <strong>{formattedTotalHeight}</strong>
          </span>
        )}
        {averageHeight !== 0 && (
          <span className='block'>
            Your average route height is <strong>{formattedAverageHeight}</strong>
          </span>
        )}
      </div>
    </Card>
  )
}
