import { sum } from '@edouardmisset/math'
import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { Card } from '~/app/_components/card/card'
import { getMostFrequentDate } from '~/helpers/date'
import {
  filterAscents,
  getHardestAscent,
  getMostFrequentCrag,
} from '~/helpers/filter-ascents'
import { filterTrainingSessions } from '~/helpers/filter-training'
import { api } from '~/trpc/server'

async function fetchData(year: number) {
  const [trainingSessions, ascents] = await Promise.all([
    api.training.getAllTrainingSessions(),
    api.ascents.getAllAscents({ year }),
  ])
  return { trainingSessions, ascents }
}

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

  const totalHeight = sum(routes.map(({ height }) => height ?? 0))

  const [mostAscentDate, mostAscent] = getMostFrequentDate(ascents)

  const daysOutside = filterTrainingSessions(trainingSessions, {
    year,
    sessionType: 'Out',
  }).length

  const { numberOfCrags, mostFrequentCrag } = getMostFrequentCrag(ascents)

  return (
    <section className="w100">
      <h1 className="section-header">{year}</h1>
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        }}
      >
        <Card>
          <h2>Days outside</h2>
          <p>
            You climbed <b>{ascents.length}</b> ascents in <b>{daysOutside}</b>{' '}
            days!
          </p>
          <p>
            Your best day was the{' '}
            <b>{new Date(mostAscentDate).toDateString()}</b> where you climbed{' '}
            <b>{mostAscent}</b> ascents!
          </p>
        </Card>
        <Card>
          <h2>Hard Sends</h2>
          <p>
            You Onsighted <b>{onsightAscents.length}</b>, Flashed{' '}
            <b>{flashAscents.length}</b>, and Redpointed{' '}
            <b>{redpointAscents.length}</b> routes and boulders.
          </p>
        </Card>
        <Card>
          <h2>Hardest</h2>
          <p>
            Your hardest route was{' '}
            <AscentComponent ascent={hardestRoute} showGrade={true} /> and your
            hardest boulder{' '}
            <AscentComponent ascent={hardestBoulder} showGrade={true} />
          </p>
        </Card>
        <Card>
          <h2>Vertical Milestone</h2>
          <p>
            You climbed <b>{routes.length}</b> routes and{' '}
            <b>{boulders.length}</b> boulders for a total of{' '}
            <b>{totalHeight}</b> meters!
          </p>
        </Card>
        <Card>
          <h2>Favorite Spot</h2>
          <p>
            You climbed in <b>{numberOfCrags}</b> different crags and you went
            to <b>{mostFrequentCrag}</b> the most!
          </p>
        </Card>
      </div>
    </section>
  )
}
