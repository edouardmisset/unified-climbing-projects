import { average, sum } from '@edouardmisset/math'
import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { Card } from '~/app/_components/card/card'
import GridLayout from '~/app/_components/grid-layout/grid-layout'
import { fromGradeToNumber, fromNumberToGrade } from '~/helpers/converters'
import { getMostFrequentDate } from '~/helpers/date'
import {
  filterAscents,
  getHardestAscent,
  getMostFrequentCrag,
} from '~/helpers/filter-ascents'
import { filterTrainingSessions } from '~/helpers/filter-training'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'

async function fetchData(year: number) {
  const [trainingSessions, ascents] = await Promise.all([
    api.training.getAllTrainingSessions(),
    api.ascents.getAllAscents({ year }),
  ])
  return { trainingSessions, ascents }
}

const fallbackBoulderHeight = 2

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = Number((await props.params).year)
  const { trainingSessions, ascents } = await fetchData(year)

  const onsightAscents = filterAscents(ascents, {
    style: 'Onsight',
  })
  const flashAscents = filterAscents(ascents, { style: 'Flash' })
  const redpointAscents = filterAscents(ascents, {
    style: 'Redpoint',
  })

  const boulders = filterAscents(ascents, { climbingDiscipline: 'Boulder' })
  const routes = filterAscents(ascents, { climbingDiscipline: 'Route' })

  const hardestRoute = getHardestAscent(routes)
  const hardestBoulder = getHardestAscent(boulders)

  const totalHeight = sum(
    ascents.map(({ height }) => height ?? fallbackBoulderHeight),
  )

  const [mostAscentDate, mostAscent] = getMostFrequentDate(ascents)

  const daysOutside = filterTrainingSessions(trainingSessions, {
    year,
    sessionType: 'Out',
  }).length

  const { numberOfCrags, mostFrequentCrag } = getMostFrequentCrag(ascents)

  const averageRouteGrade = fromNumberToGrade(
    Math.round(
      average(...routes.map(({ topoGrade }) => fromGradeToNumber(topoGrade))),
    ),
  )
  const averageBoulderGrade = fromNumberToGrade(
    Math.round(
      average(...boulders.map(({ topoGrade }) => fromGradeToNumber(topoGrade))),
    ),
  )

  const mostRecentAscent = ascents.at(0) as Ascent

  const highestDegree = Math.max(
    ...ascents.map(({ topoGrade }) => Number(topoGrade[0])),
  )

  const ascentsInTheHardestDegree = ascents.filter(({ topoGrade }) =>
    topoGrade.startsWith(highestDegree.toString()),
  ).length

  return (
    <GridLayout title={year}>
      <Card>
        <h2>Days outside</h2>
        <p>
          You climbed <b>{ascents.length}</b> ascents in <b>{daysOutside}</b>{' '}
          days.
        </p>
        <p>
          Your best day was the <b>{new Date(mostAscentDate).toDateString()}</b>{' '}
          where you climbed <b>{mostAscent}</b> ascents.
        </p>
      </Card>
      <Card>
        <h2>Ascents</h2>
        <p>
          Your last ascent was{' '}
          <AscentComponent ascent={mostRecentAscent} showGrade={true} />
        </p>
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
        <p>
          Your hardest route was{' '}
          <AscentComponent ascent={hardestRoute} showGrade={true} /> and your
          hardest boulder{' '}
          <AscentComponent ascent={hardestBoulder} showGrade={true} />
        </p>
        <p>
          You made <b>{ascentsInTheHardestDegree}</b> climbs in the{' '}
          <b>{highestDegree}</b>
          <sup>th</sup> degree.
        </p>
      </Card>
      <Card>
        <h2>Vertical Milestone</h2>
        <p>
          You climbed <b>{routes.length}</b> routes and <b>{boulders.length}</b>{' '}
          boulders for a total of <b>{totalHeight}</b> meters.
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
