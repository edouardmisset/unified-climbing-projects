import { average } from '@edouardmisset/math'
import { sum } from '@edouardmisset/math/sum.ts'
import { DEFAULT_BOULDER_HEIGHT } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { formatUnit } from '~/helpers/number-formatter'
import type { AscentListProps } from '~/schema/ascent'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../ui/card/card'

export function VerticalMilestoneSummary({ ascents }: AscentListProps) {
  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  if (boulders.length === 0 && routes.length === 0) return

  const totalHeight = sum(
    ...routes.map(({ height }) => height ?? 0),
    ...boulders.map(({ height }) => height ?? DEFAULT_BOULDER_HEIGHT),
  )

  const averageHeight =
    routes.length > 0 ? Math.round(average(...routes.map(({ height }) => height ?? 0))) : 0

  const formattedTotalHeight = formatUnit(totalHeight, 'meter', { unitDisplay: 'long' })
  const formattedAverageHeight = formatUnit(averageHeight, 'meter', { unitDisplay: 'long' })

  return (
    <Card>
      <h2>Vertical Milestone</h2>
      <p>
        {routes.length !== 0 && (
          <span className='block'>
            You climbed <AscentsWithPopover ascents={routes} />
          </span>
        )}
        {boulders.length !== 0 && (
          <span className='block'>
            You climbed <AscentsWithPopover ascents={boulders} />
          </span>
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
      </p>
    </Card>
  )
}
