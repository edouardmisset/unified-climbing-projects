import { sum } from '@edouardmisset/math'
import { objectSize } from '@edouardmisset/object'
import { AscentComponent } from '~/app/_components/ascent-component/ascent-component'
import { Card } from '~/app/_components/card/card'
import { fromGradeToNumber } from '~/helpers/converters'
import { frequencyBy } from '~/helpers/frequency-by'
import { sortNumericalValues } from '~/helpers/sort-values.ts'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { api } from '~/trpc/server'

async function fetchData(year: number) {
  const [trainingSessions, ascents] = await Promise.all([
    api.training.getAllTrainingSessions(),
    api.ascents.getAllAscents({ year }),
  ])
  return { trainingSessions, ascents }
}

function getFilteredAscents(ascents: Ascent[], ascentStyle: Ascent['style']) {
  return ascents.filter(({ style }) => style === ascentStyle).length
}

function filterByDiscipline(
  ascents: Ascent[],
  discipline: Ascent['climbingDiscipline'],
) {
  return ascents.filter(
    ({ climbingDiscipline }) => climbingDiscipline === discipline,
  )
}

function getHardestAscent(ascents: Ascent[]) {
  return ascents.reduce(
    (prev, current) =>
      fromGradeToNumber(prev?.topoGrade ?? '1a') >
      fromGradeToNumber(current.topoGrade)
        ? prev
        : current,
    ascents[0] as Ascent,
  )
}

function getMostFrequentDate(ascents: Ascent[]) {
  const ascentsByDate = frequencyBy(ascents, 'date')
  const sortedAscentsByDate = sortNumericalValues(ascentsByDate, {
    ascending: false,
  })
  return Object.entries(sortedAscentsByDate)[0] ?? ['', 0]
}

function getDaysOutside(trainingSessions: TrainingSession[], year: number) {
  return trainingSessions.filter(
    session =>
      session.sessionType === 'Out' &&
      new Date(session.date).getFullYear() === year,
  ).length
}

function getMostFrequentCrag(ascents: Ascent[]) {
  const sortedCrags = frequencyBy(ascents, 'crag', { ascending: false })

  return {
    numberOfCrags: objectSize(sortedCrags),
    mostFrequentCrag: Object.keys(sortedCrags)[0],
  }
}

export default async function Page(props: {
  params: Promise<{ year: string }>
}) {
  const year = Number((await props.params).year)
  const { trainingSessions, ascents } = await fetchData(year)

  const onsightAscents = getFilteredAscents(ascents, 'Onsight')
  const flashAscents = getFilteredAscents(ascents, 'Flash')
  const redpointAscents = getFilteredAscents(ascents, 'Redpoint')

  const boulders = filterByDiscipline(ascents, 'Boulder')
  const routes = filterByDiscipline(ascents, 'Route')

  const hardestRoute = getHardestAscent(routes)
  const hardestBoulder = getHardestAscent(boulders)

  const totalHeight = sum(routes.map(({ height }) => height ?? 0))

  const [mostAscentDate, mostAscent] = getMostFrequentDate(ascents)

  const daysOutside = getDaysOutside(trainingSessions, year)

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
            You Onsighted <b>{onsightAscents}</b>, Flashed <b>{flashAscents}</b>
            , and Redpointed <b>{redpointAscents}</b> routes and boulders.
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
