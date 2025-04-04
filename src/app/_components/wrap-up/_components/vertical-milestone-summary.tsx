import { sum } from '@edouardmisset/math/sum.ts'
import { DEFAULT_BOULDER_HEIGHT } from '~/constants/ascents'
import { filterAscents } from '~/helpers/filter-ascents'
import { frenchNumberFormatter } from '~/helpers/number-formatter'
import type { Ascent } from '~/schema/ascent'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

export function VerticalMilestoneSummary({ ascents }: { ascents: Ascent[] }) {
  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  if (boulders.length === 0 && routes.length === 0) return undefined

  const totalHeight = sum(
    ...routes.map(({ height }) => height ?? 0),
    ...boulders.map(({ height }) => height ?? DEFAULT_BOULDER_HEIGHT),
  )

  const formattedTotalHeight = frenchNumberFormatter(totalHeight)

  return (
    <Card>
      <h2>Vertical Milestone</h2>
      {routes.length === 0 ? undefined : (
        <p>
          You climbed <AscentsWithPopover ascents={routes} />
        </p>
      )}
      {boulders.length === 0 ? undefined : (
        <p>
          You climbed <AscentsWithPopover ascents={boulders} />
        </p>
      )}
      {totalHeight === 0 ? undefined : (
        <p>
          In total, you climbed <strong>{formattedTotalHeight}</strong> meters
        </p>
      )}
    </Card>
  )
}
