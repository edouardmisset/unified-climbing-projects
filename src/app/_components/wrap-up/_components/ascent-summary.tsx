import { getAverageGrade } from '~/helpers/get-average-grade'
import type { AscentListProps } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../ui/card/card'
import { ClimbingStyle } from '../../climbing/climbing-style/climbing-style'
import { DisplayGrade } from '../../climbing/display-grade/display-grade'
import { sortByDate } from '@edouardmisset/date'

export function AscentSummary({ ascents }: AscentListProps) {
  const [mostRecentAscent] = ascents.toSorted((a, b) => sortByDate(a, b))

  if (ascents.length === 0 || mostRecentAscent === undefined) return

  const ascentsByStyle = Object.groupBy(ascents, ascent => ascent.style)
  const ascentsByDiscipline = Object.groupBy(ascents, ascent => ascent.discipline)

  const onsightAscents = ascentsByStyle.Onsight ?? []
  const flashAscents = ascentsByStyle.Flash ?? []
  const redpointAscents = ascentsByStyle.Redpoint ?? []

  const boulders = ascentsByDiscipline.Bouldering ?? []
  const routes = ascentsByDiscipline.Sport ?? []

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  return (
    <Card>
      <h2>Ascents</h2>

      <div>
        <span className='block'>
          Your last {mostRecentAscent.discipline.toLowerCase()} was{' '}
          <AscentComponent ascent={mostRecentAscent} />
        </span>

        {onsightAscents.length === 0 ? undefined : (
          <div>
            You <ClimbingStyle climbingStyle='onsighted' />{' '}
            <AscentsWithPopover ascents={onsightAscents} />
          </div>
        )}
        {flashAscents.length === 0 ? undefined : (
          <div>
            You <ClimbingStyle climbingStyle='flashed' />{' '}
            <AscentsWithPopover ascents={flashAscents} />
          </div>
        )}
        {redpointAscents.length === 0 ? undefined : (
          <div>
            You <ClimbingStyle climbingStyle='redpointed' />{' '}
            <AscentsWithPopover ascents={redpointAscents} />
          </div>
        )}

        {averageRouteGrade === 'N/A' ? undefined : (
          <span className='block'>
            Your average route grade was{' '}
            <DisplayGrade discipline='Sport' grade={averageRouteGrade} />
          </span>
        )}
        {averageBoulderGrade === 'N/A' ? undefined : (
          <span className='block'>
            Your average bouldering grade was{' '}
            <DisplayGrade discipline='Bouldering' grade={averageBoulderGrade} />
          </span>
        )}
      </div>
    </Card>
  )
}
