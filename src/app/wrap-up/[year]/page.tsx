import { frequency } from '@edouardmisset/array'
import { sum } from '@edouardmisset/math'
import { objectSize } from '@edouardmisset/object'
import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { Card } from '~/app/_components/card/card'
import { fromGradeToNumber } from '~/helpers/converters'
import { sortNumericalValues } from '~/helpers/sort-values.ts'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/server'

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = Number((await props.params).year)

  const trainingSessions = await api.training.getAllTrainingSessions()
  const ascents = await api.ascents.getAllAscents({ year })

  const onsightAscents = ascents.filter(
    ({ style }) => style === 'Onsight',
  ).length
  const flashAscents = ascents.filter(({ style }) => style === 'Flash').length
  const redpointAscents = ascents.filter(
    ({ style }) => style === 'Redpoint',
  ).length

  const boulders = ascents.filter(
    ({ climbingDiscipline }) => climbingDiscipline === 'Boulder',
  )
  const routes = ascents.filter(
    ({ climbingDiscipline }) => climbingDiscipline === 'Route',
  )

  const hardestRoute = routes.reduce(
    (prev, current) =>
      fromGradeToNumber(prev?.topoGrade ?? '1a') >
      fromGradeToNumber(current.topoGrade)
        ? prev
        : current,
    ascents[0] as Ascent,
  )
  const hardestBoulder = boulders.reduce(
    (prev, current) =>
      fromGradeToNumber(prev?.topoGrade ?? '1a') >
      fromGradeToNumber(current.topoGrade)
        ? prev
        : current,
    ascents[0] as Ascent,
  )

  const totalHeight = sum(routes.map(({ height }) => height ?? 0))

  const ascentsByDate = frequency(ascents.map(({ date }) => date))
  const sortedAscentsByDate = sortNumericalValues(ascentsByDate, {
    ascending: false,
  })
  const [mostAscentDate = '', mostAscent = 0] =
    Object.entries(sortedAscentsByDate)[0] ?? []

  const daysOutside = trainingSessions.filter(
    trainingSession =>
      trainingSession.sessionType === 'Out' &&
      new Date(trainingSession.date).getFullYear() === year,
  ).length

  const sortedCrags = sortNumericalValues(
    frequency(ascents.map(({ crag }) => crag)),
    { ascending: false },
  )
  const numberOfCrags = objectSize(sortedCrags)
  const mostFrequentCrag = Object.keys(sortedCrags)[0]

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
            You Onsighted <b>{onsightAscents}</b>, Flashed <b>{flashAscents}</b>
            , and Redpointed <b>{redpointAscents}</b> routes and boulders.
          </p>
        </Card>
        <Card>
          <h2>Hardest</h2>
          <p>
            Your hardest route was{' '}
            <AscentComponent ascent={hardestRoute} showGrade={true} />, and your
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
