import { filterAscents, getHardestAscent } from '~/helpers/filter-ascents'
import type { Ascent } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

export function HardestClimbsSummary({
  ascents,
}: {
  ascents: Ascent[]
}) {
  if (ascents.length === 0) return undefined

  const highestDegree = Math.max(
    ...ascents.map(({ topoGrade }) => Number(topoGrade[0])),
  )

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  )

  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  const hardestRoute = routes.length > 0 ? getHardestAscent(routes) : undefined
  const hardestBoulder =
    boulders.length > 0 ? getHardestAscent(boulders) : undefined

  return (
    <Card>
      <h2>Hardest Sends</h2>
      {hardestRoute ? (
        <p>
          Your hardest route was{' '}
          <AscentComponent ascent={hardestRoute} showGrade={true} />
        </p>
      ) : undefined}
      {hardestBoulder ? (
        <p>
          Your hardest boulder was{' '}
          <AscentComponent ascent={hardestBoulder} showGrade={true} />
        </p>
      ) : undefined}
      <p>
        You climbed <AscentsWithPopover ascents={ascentsInTheHardestDegree} />{' '}
        in the <strong>{highestDegree}</strong>
        <sup>th</sup> degree
      </p>
    </Card>
  )
}
