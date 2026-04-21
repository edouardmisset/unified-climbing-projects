import { getAverageGrade } from '~/ascents/helpers/get-average-grade'
import { sortByDate } from '~/shared/helpers/sort-by-date'
import type { AscentListProps } from '~/ascents/schema'
import { AscentComponent } from '~/ascents/components/ascent-component/ascent-component'
import { AscentsWithPopover } from '~/ascents/components/ascents-with-popover/ascents-with-popover'
import { Card } from '~/shared/components/ui/card/card'
import { ClimbingStyle } from '~/shared/components/climbing/climbing-style/climbing-style'
import { DisplayGrade } from '~/shared/components/climbing/display-grade/display-grade'

export function AscentSummary({ ascents }: AscentListProps) {
  const [mostRecentAscent] = ascents.toSorted((a, b) => sortByDate(a, b))

  if (ascents.length === 0 || mostRecentAscent === undefined) return

  const ascentsByStyle = Object.groupBy(ascents, ascent => ascent.style)
  const ascentsByDiscipline = Object.groupBy(ascents, ascent => ascent.climbingDiscipline)

  const onsightAscents = ascentsByStyle.Onsight ?? []
  const flashAscents = ascentsByStyle.Flash ?? []
  const redpointAscents = ascentsByStyle.Redpoint ?? []

  const boulders = ascentsByDiscipline.Boulder ?? []
  const routes = ascentsByDiscipline.Route ?? []

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  return (
    <Card>
      <h2>Ascents</h2>

      <p>
        <span className='block'>
          Your last {mostRecentAscent.climbingDiscipline.toLowerCase()} was{' '}
          <AscentComponent ascent={mostRecentAscent} />
        </span>

        {onsightAscents.length === 0 ? undefined : (
          <span className='block'>
            You <ClimbingStyle climbingStyle='onsighted' />{' '}
            <AscentsWithPopover ascents={onsightAscents} />
          </span>
        )}
        {flashAscents.length === 0 ? undefined : (
          <span className='block'>
            You <ClimbingStyle climbingStyle='flashed' />{' '}
            <AscentsWithPopover ascents={flashAscents} />
          </span>
        )}
        {redpointAscents.length === 0 ? undefined : (
          <span className='block'>
            You <ClimbingStyle climbingStyle='redpointed' />{' '}
            <AscentsWithPopover ascents={redpointAscents} />
          </span>
        )}

        {averageRouteGrade === 'N/A' ? undefined : (
          <span className='block'>
            Your average route grade was{' '}
            <DisplayGrade climbingDiscipline='Route' grade={averageRouteGrade} />
          </span>
        )}
        {averageBoulderGrade === 'N/A' ? undefined : (
          <span className='block'>
            Your average bouldering grade was{' '}
            <DisplayGrade climbingDiscipline='Boulder' grade={averageBoulderGrade} />
          </span>
        )}
      </p>
    </Card>
  )
}
