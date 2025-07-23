import { filterAscents } from '~/helpers/filter-ascents'
import { getAverageGrade } from '~/helpers/get-average-grade'
import { sortByDate } from '~/helpers/sort-by-date'
import type { Ascent } from '~/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'
import { ClimbingStyle } from '../../climbing/climbing-style/climbing-style'
import { DisplayGrade } from '../../climbing/display-grade/display-grade'

export function AscentSummary({ ascents }: { ascents: Ascent[] }) {
  const mostRecentAscent = ascents.toSorted((a, b) => sortByDate(a, b))[0]

  if (ascents.length === 0 || mostRecentAscent === undefined) return undefined

  const onsightAscents = filterAscents(ascents, {
    style: 'Onsight',
  })
  const flashAscents = filterAscents(ascents, { style: 'Flash' })
  const redpointAscents = filterAscents(ascents, {
    style: 'Redpoint',
  })

  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  return (
    <Card>
      <h2>Ascents</h2>

      <p>
        <span className="block">
          Your last {mostRecentAscent.climbingDiscipline.toLowerCase()} was{' '}
          <AscentComponent ascent={mostRecentAscent} showGrade={true} />
        </span>

        {onsightAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle style="onsighted" />{' '}
            <AscentsWithPopover ascents={onsightAscents} />
          </span>
        )}
        {flashAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle style="flashed" />{' '}
            <AscentsWithPopover ascents={flashAscents} />
          </span>
        )}
        {redpointAscents.length === 0 ? undefined : (
          <span className="block">
            You <ClimbingStyle style="redpointed" />{' '}
            <AscentsWithPopover ascents={redpointAscents} />
          </span>
        )}

        {averageRouteGrade === 'N/A' ? undefined : (
          <span className="block">
            Your average route grade was{' '}
            <DisplayGrade
              climbingDiscipline="Route"
              grade={averageRouteGrade}
            />
          </span>
        )}
        {averageBoulderGrade === 'N/A' ? undefined : (
          <span className="block">
            Your average bouldering grade was{' '}
            <DisplayGrade
              climbingDiscipline="Boulder"
              grade={averageBoulderGrade}
            />
          </span>
        )}
      </p>
    </Card>
  )
}
