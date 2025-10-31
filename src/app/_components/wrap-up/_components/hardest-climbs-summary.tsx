import { filterAscents, getHardestAscent } from '~/helpers/filter-ascents'
import { type AscentListProps, BOULDERING, SPORT } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

export function HardestClimbsSummary({ ascents }: AscentListProps) {
  if (ascents.length === 0) return undefined

  const highestDegree = Math.max(
    ...ascents.map(({ grade: topoGrade }) => Number(topoGrade[0])),
  )

  const ascentsInTheHardestDegree = ascents.filter(({ grade: topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  )

  const boulders = filterAscents(ascents, { discipline: BOULDERING })
  const routes = filterAscents(ascents, { discipline: SPORT })

  const hardestRoute = routes.length > 0 ? getHardestAscent(routes) : undefined
  const hardestBoulder =
    boulders.length > 0 ? getHardestAscent(boulders) : undefined

  return (
    <Card>
      <h2>Hardest Sends</h2>
      <p>
        {hardestRoute ? (
          <span className="block">
            Your hardest route was{' '}
            <AscentComponent ascent={hardestRoute} showGrade />
          </span>
        ) : undefined}
        {hardestBoulder ? (
          <span className="block">
            Your hardest boulder was{' '}
            <AscentComponent ascent={hardestBoulder} showGrade />
          </span>
        ) : undefined}
        <span className="block">
          You climbed <AscentsWithPopover ascents={ascentsInTheHardestDegree} />{' '}
          in the <strong>{highestDegree}</strong>
          <sup>th</sup> degree
        </span>
      </p>
    </Card>
  )
}
