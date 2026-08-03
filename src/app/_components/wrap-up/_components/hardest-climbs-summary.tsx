import { filterAscents, getHardestAscent } from '~/helpers/filter-ascents'
import type { AscentListProps } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../ui/card/card'

// Conditional branches directly represent optional route and boulder sentences.
// fallow-ignore-next-line complexity
export function HardestClimbsSummary({ ascents }: AscentListProps) {
  if (ascents.length === 0) return

  const highestDegree = Math.max(...ascents.map(({ grade }) => Number(grade[0])))

  const ascentsInTheHardestDegree = ascents.filter(({ grade }) =>
    grade.startsWith(highestDegree.toString()),
  )

  const boulders = filterAscents(ascents, { discipline: 'Bouldering' })
  const routes = filterAscents(ascents, { discipline: 'Sport' })

  const hardestRoute = routes.length > 0 ? getHardestAscent(routes) : undefined
  const hardestBoulder = boulders.length > 0 ? getHardestAscent(boulders) : undefined

  return (
    <Card>
      <h2>Hardest Sends</h2>
      <p>
        {hardestRoute === undefined ? undefined : (
          <span className='block'>
            Your hardest route was <AscentComponent ascent={hardestRoute} />
          </span>
        )}
        {hardestBoulder === undefined ? undefined : (
          <span className='block'>
            Your hardest boulder was <AscentComponent ascent={hardestBoulder} />
          </span>
        )}
        <span className='block'>
          You climbed <AscentsWithPopover ascents={ascentsInTheHardestDegree} /> in the{' '}
          <strong>{highestDegree}</strong>
          <sup>th</sup> degree
        </span>
      </p>
    </Card>
  )
}
