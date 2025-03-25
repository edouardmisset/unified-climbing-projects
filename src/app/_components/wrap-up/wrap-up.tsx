import { sum } from '@edouardmisset/math/sum.ts'
import { DEFAULT_BOULDER_HEIGHT } from '~/constants/ascents'
import { formatDateTime, getMostFrequentDate } from '~/helpers/date'
import {
  filterAscents,
  getCragsDetails,
  getHardestAscent,
} from '~/helpers/filter-ascents'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { getAverageGrade } from '~/helpers/get-average-grade'
import { api } from '~/trpc/server'
import { AscentComponent } from '../ascent-component/ascent-component'
import { AscentsWithPopover } from '../ascents-with-popover/ascents-with-popover'
import { Card } from '../card/card'
import GridLayout from '../grid-layout/grid-layout'
import { Popover } from '../popover/popover'
import { ALL_TIME } from './constants'

import ascentsWithPopoverStyles from '~/app/_components/ascents-with-popover/ascents-with-popover.module.css'

async function fetchData(year?: number) {
  const [trainingSessionsPromise, ascentsPromise] = await Promise.allSettled([
    api.training.getAllTrainingSessions({ year }),
    api.ascents.getAllAscents({ year }),
  ])
  return { trainingSessionsPromise, ascentsPromise }
}

export default async function WrapUp({ year }: { year?: number }) {
  const { trainingSessionsPromise, ascentsPromise } = await fetchData(year)

  if (
    ascentsPromise.status === 'rejected' ||
    trainingSessionsPromise.status === 'rejected' ||
    ascentsPromise.value.length === 0 ||
    trainingSessionsPromise.value.length === 0
  ) {
    return (
      <GridLayout title={year ?? ALL_TIME}>
        <Card>
          <h2>No Data</h2>
          <p>
            You haven't logged any data yet. Go climb some routes and train!
          </p>
        </Card>
      </GridLayout>
    )
  }

  const ascents = ascentsPromise.value
  const trainingSessions = trainingSessionsPromise.value

  // ASCENTS

  const onsightAscents = filterAscents(ascents, {
    style: 'Onsight',
  })
  const flashAscents = filterAscents(ascents, { style: 'Flash' })
  const redpointAscents = filterAscents(ascents, {
    style: 'Redpoint',
  })

  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  const hardestRoute = routes.length > 0 ? getHardestAscent(routes) : undefined
  const hardestBoulder =
    boulders.length > 0 ? getHardestAscent(boulders) : undefined

  const totalHeight = sum(
    ...routes.map(({ height }) => height ?? 0),
    ...boulders.map(({ height }) => height ?? DEFAULT_BOULDER_HEIGHT),
  )
  const formattedTotalHeight = new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
  }).format(totalHeight)

  const [mostAscentDate] = getMostFrequentDate(ascents)

  const ascentsInMostAscentDay = ascents.filter(({ date }) => {
    return new Date(date).getTime() === new Date(mostAscentDate).getTime()
  })

  const { numberOfCrags, mostFrequentCrag, crags } = getCragsDetails(ascents)

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  const mostRecentAscent = ascents.at(0)

  const highestDegree = Math.max(
    ...ascents.map(({ topoGrade }) => Number(topoGrade[0])),
  )

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  )

  // TRAINING

  const daysOutside = filterTrainingSessions(trainingSessions, {
    sessionType: 'Out',
  }).length

  const ascentsRatio = (ascents.length / daysOutside).toFixed(1)

  return (
    <GridLayout title={year ?? ALL_TIME}>
      <Card>
        <h2>Days outside</h2>
        <p>
          {ascents.length === 0 ? undefined : (
            <>
              You climbed <AscentsWithPopover ascents={ascents} /> in{' '}
              <strong>{daysOutside}</strong> days (
              <strong>{ascentsRatio}</strong> ascents per day outside).
            </>
          )}
        </p>
        {mostAscentDate === '' ||
        ascentsInMostAscentDay.length === 0 ? undefined : (
          <p>
            Your best day was the{' '}
            <span>
              <strong>
                {formatDateTime(new Date(mostAscentDate), 'longDate')}
              </strong>
            </span>{' '}
            where you climbed{' '}
            <AscentsWithPopover ascents={ascentsInMostAscentDay} />.
          </p>
        )}
      </Card>
      <Card>
        <h2>Ascents</h2>
        {mostRecentAscent !== undefined && (
          <p>
            Your last {mostRecentAscent.climbingDiscipline.toLowerCase()} was{' '}
            <AscentComponent ascent={mostRecentAscent} showGrade={true} />
          </p>
        )}
        <p>
          You{' '}
          {onsightAscents.length === 0 ? undefined : (
            <span>
              <i>Onsighted</i> <AscentsWithPopover ascents={onsightAscents} />,{' '}
            </span>
          )}
          {flashAscents.length === 0 ? undefined : (
            <span>
              <i>Flashed</i> <AscentsWithPopover ascents={flashAscents} />,{' '}
            </span>
          )}
          {redpointAscents.length === 0 ? undefined : (
            <span>
              and <i>Redpointed</i>{' '}
              <AscentsWithPopover ascents={redpointAscents} />.
            </span>
          )}
        </p>
        <p>
          Your average grade{' '}
          {averageRouteGrade === 'N/A' ? undefined : (
            <>
              was <strong>{averageRouteGrade}</strong> for routes
            </>
          )}
          {averageBoulderGrade === 'N/A' ? undefined : (
            <>
              {' '}
              and <strong>{averageBoulderGrade}</strong> for boulders
            </>
          )}
          .
        </p>
      </Card>
      <Card>
        <h2>Hardest Sends</h2>
        {hardestRoute && (
          <p>
            Your hardest route was{' '}
            <AscentComponent ascent={hardestRoute} showGrade={true} />
          </p>
        )}
        {hardestBoulder && (
          <p>
            Your hardest boulder was{' '}
            <AscentComponent ascent={hardestBoulder} showGrade={true} />
          </p>
        )}
        <p>
          You climbed <AscentsWithPopover ascents={ascentsInTheHardestDegree} />{' '}
          in the <strong>{highestDegree}</strong>
          <sup>th</sup> degree.
        </p>
      </Card>
      <Card>
        <h2>Vertical Milestone</h2>
        <p>
          {routes.length === 0 ? undefined : (
            <>
              You climbed <AscentsWithPopover ascents={routes} />{' '}
            </>
          )}
          {boulders.length === 0 ? undefined : (
            <>
              and <AscentsWithPopover ascents={boulders} />
            </>
          )}{' '}
          {boulders.length === 0 && routes.length === 0 ? undefined : (
            <>
              for a total of <strong>{formattedTotalHeight}</strong> meters.
            </>
          )}
        </p>
      </Card>
      {crags.length === 0 ? undefined : (
        <Card>
          <h2>Favorite Crag</h2>
          <p>
            You visited{' '}
            <Popover
              triggerClassName={ascentsWithPopoverStyles.popover}
              popoverDescription={
                <div className={ascentsWithPopoverStyles.popoverContainer}>
                  {crags.map(crag => (
                    <span key={crag}>{crag}</span>
                  ))}
                </div>
              }
              popoverTitle="Crags"
              triggerContent={
                <span>
                  <strong>{numberOfCrags}</strong> crags
                </span>
              }
            />{' '}
            and you went to <strong>{mostFrequentCrag}</strong> the most.
          </p>
        </Card>
      )}
    </GridLayout>
  )
}
