import { filterAscents, getHardestAscent } from '~/ascents/helpers/filter-ascents'
import type { AscentListProps } from '~/ascents/schema'
import { AscentComponent } from '~/ascents/components/ascent-component/ascent-component'
import { AscentsWithPopover } from '~/ascents/components/ascents-with-popover/ascents-with-popover'
import { Card } from '~/shared/components/ui/card/card'

export function HardestClimbsSummary({ ascents }: AscentListProps) {
  if (ascents.length === 0) return

  const highestDegree = Math.max(...ascents.map(({ topoGrade }) => Number(topoGrade[0])))

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  )

  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

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
