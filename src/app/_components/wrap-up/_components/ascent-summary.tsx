import { getAverageGrade } from '~/helpers/get-average-grade'
import { sortByDate } from '~/helpers/sort-by-date'
import type { AscentListProps } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'
import { ClimbingStyle } from '../../climbing/climbing-style/climbing-style'
import { DisplayGrade } from '../../climbing/display-grade/display-grade'

export function AscentSummary({ ascents }: AscentListProps) {
  const mostRecentAscent = ascents.toSorted((a, b) => sortByDate(a, b))[0]

  if (ascents.length === 0 || mostRecentAscent === undefined) return undefined

  const ascentsByStyle = Object.groupBy(ascents, ascent => ascent.style)
  const ascentsByDiscipline = Object.groupBy(
    ascents,
    ascent => ascent.discipline,
  )

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

      <p>
        <span className="block">
          Your last {mostRecentAscent.discipline.toLowerCase()} was{' '}
          <AscentComponent ascent={mostRecentAscent} showGrade />
        </span>

        {onsightAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle climbingStyle="onsighted" />{' '}
            <AscentsWithPopover ascents={onsightAscents} />
          </span>
        )}
        {flashAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle climbingStyle="flashed" />{' '}
            <AscentsWithPopover ascents={flashAscents} />
          </span>
        )}
        {redpointAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle climbingStyle="redpointed" />{' '}
            <AscentsWithPopover ascents={redpointAscents} />
          </span>
        )}

        {averageRouteGrade === 'N/A' ? undefined : (
          <span className="block">
            Your average route grade was{' '}
            <DisplayGrade discipline="Sport" grade={averageRouteGrade} />
          </span>
        )}
        {averageBoulderGrade === 'N/A' ? undefined : (
          <span className="block">
            Your average bouldering grade was{' '}
            <DisplayGrade discipline="Bouldering" grade={averageBoulderGrade} />
          </span>
        )}
      </p>
    </Card>
  )
}
