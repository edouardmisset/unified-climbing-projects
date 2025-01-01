import { sum } from '@edouardmisset/math/sum.ts'

import { DEFAULT_BOULDER_HEIGHT } from '~/constants/ascents'
import { formatDateTime, getMostFrequentDate } from '~/helpers/date'
import {
  filterAscents,
  getHardestAscent,
  getMostFrequentCrag,
} from '~/helpers/filter-ascents'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { getAverageGrade } from '~/helpers/get-average-grade'
import { api } from '~/trpc/server'
import { AscentComponent } from '../ascent-component/ascent-component'
import { Card } from '../card/card'
import GridLayout from '../grid-layout/grid-layout'
import { ALL_TIME } from './constants'

async function fetchData(year?: number) {
  const [trainingSessions, ascents] = await Promise.all([
    api.training.getAllTrainingSessions({ year }),
    api.ascents.getAllAscents({ year }),
  ])
  return { trainingSessions, ascents }
}

export default async function WrapUp({ year }: { year?: number }) {
  const { trainingSessions, ascents } = await fetchData(year)

  if (ascents.length === 0) {
    return (
      <GridLayout title={year ?? ALL_TIME}>
        <Card>
          <h2>No ascents</h2>
          <p>
            You haven't logged any ascents yet. Go climb some routes and
            boulders!
          </p>
        </Card>
      </GridLayout>
    )
  }

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

  const [mostAscentDate, mostAscent] = getMostFrequentDate(ascents)

  const { numberOfCrags, mostFrequentCrag } = getMostFrequentCrag(ascents)

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  const mostRecentAscent = ascents.at(0)

  const highestDegree = Math.max(
    ...ascents.map(({ topoGrade }) => Number(topoGrade[0])),
  )

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  ).length

  // TRAINING

  const daysOutside = filterTrainingSessions(trainingSessions, {
    sessionType: 'Out',
  }).length

  return (
    <GridLayout title={year ?? ALL_TIME}>
      <Card>
        <h2>Days outside</h2>
        <p>
          You climbed <b>{ascents.length}</b> ascents in <b>{daysOutside}</b>{' '}
          days.
        </p>
        {mostAscentDate !== '' && (
          <p>
            Your best day was the{' '}
            <span>
              <b>{formatDateTime(new Date(mostAscentDate), 'longDate')}</b>
            </span>{' '}
            where you climbed <b>{mostAscent}</b> ascents.
          </p>
        )}
      </Card>
      <Card>
        <h2>Ascents</h2>
        {mostRecentAscent !== undefined && (
          <p>
            Your last ascent was{' '}
            <AscentComponent ascent={mostRecentAscent} showGrade={true} />
          </p>
        )}
        <p>
          You Onsighted <b>{onsightAscents.length}</b>, Flashed{' '}
          <b>{flashAscents.length}</b>, and Redpointed{' '}
          <b>{redpointAscents.length}</b> routes and boulders.
        </p>
        <p>
          Your average grade was <b>{averageRouteGrade}</b> for routes and{' '}
          <b>{averageBoulderGrade}</b> for boulders.
        </p>
      </Card>
      <Card>
        <h2>Hardest Sends</h2>
        {hardestRoute === undefined ? null : (
          <p>
            Your hardest route was{' '}
            <AscentComponent ascent={hardestRoute} showGrade={true} />
          </p>
        )}
        {hardestBoulder === undefined ? null : (
          <p>
            Your hardest boulder was{' '}
            <AscentComponent ascent={hardestBoulder} showGrade={true} />
          </p>
        )}
        <p>
          You climbed <b>{ascentsInTheHardestDegree}</b> routes in the{' '}
          <b>{highestDegree}</b>
          <sup>th</sup> degree.
        </p>
      </Card>
      <Card>
        <h2>Vertical Milestone</h2>
        <p>
          You climbed <b>{routes.length}</b> routes and <b>{boulders.length}</b>{' '}
          boulders for a total of <b>{formattedTotalHeight}</b> meters.
        </p>
      </Card>
      <Card>
        <h2>Favorite Crag</h2>
        <p>
          You visited <b>{numberOfCrags}</b> different crags and you went to{' '}
          <b>{mostFrequentCrag}</b> the most.
        </p>
      </Card>
    </GridLayout>
  )
}
