import { api } from '~/trpc/server'
import styles from './index.module.css'

const searchedRouteName = 'no'

export default async function Home() {
  // Areas
  const areas = await api.areas.getAllAreas()
  const areaDuplicates = await api.areas.duplicates()
  const areaSimilar = await api.areas.similar()
  const areaFrequency = await api.areas.frequency()
  // Crags
  const crags = await api.crags.getAllCrags()
  const cragDuplicates = await api.crags.getDuplicateCrags()
  const cragSimilar = await api.crags.getSimilarCrags()
  const cragFrequency = await api.crags.getCragsFrequency()
  // Ascents
  const ascents = await api.ascents.getAllAscents({
    descending: true,
  })
  const duplicateAscents = await api.ascents.getDuplicates()
  const similarAscents = await api.ascents.getSimilar()
  const searchedAscents = await api.ascents.search({
    query: searchedRouteName,
  })
  // Grades
  const grades = await api.grades.getAllGrades()
  const gradeAverage = await api.grades.getAverage()
  const gradeFrequency = await api.grades.getFrequency()
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to my climbing app</h1>
        <div
          style={{
            display: 'grid',
          }}
        >
          <div id="ascents">
            <h2>Ascents ({ascents.length}):</h2>
            <p>
              Latest ascent:{' '}
              {ascents.slice(0, 1).map(ascent => ascent.routeName)}
            </p>
            <p>{duplicateAscents.length} duplicate ascents</p>
            <p>{similarAscents.length} similar ascents</p>
            <p>
              Searched for "{searchedRouteName}" and found{' '}
              <b>
                {searchedAscents
                  .slice(0, 2)
                  .map(route => route.routeName)
                  ?.join(' and ') ?? 'nothing'}
              </b>
            </p>
          </div>
          <div id="crags">
            <h2>Crags ({crags.length}):</h2>
            <p>{cragDuplicates.length} crags with duplicates</p>
            <p>{cragSimilar.length} crags with similar names</p>
            <p>
              Most climbed crags:{' '}
              {Object.entries(cragFrequency)
                .map(([crag, count]) => [crag, count])
                .sort(([_a, a], [_b, b]) => {
                  if (typeof a === 'number' && typeof b === 'number')
                    return b - a
                  return 0
                })
                .slice(0, 4)
                .map(([crag, count]) => `${crag} (${count})`)
                ?.join(' - ')}
            </p>
          </div>
          <div id="grades">
            <h2>Grades:</h2>
            <p>Hardes grade: {grades.at(-1)}</p>
            <p>Average grade: {gradeAverage}</p>
            <p>
              Most climbed grade:{' '}
              {Object.entries(gradeFrequency)
                .map(([grade, count]) => [grade, count])
                .sort(([_a, a], [_b, b]) => {
                  if (typeof a === 'number' && typeof b === 'number')
                    return b - a
                  return 0
                })[0]
                ?.join(' - ')}{' '}
              climbs
            </p>
          </div>
          <div id="areas">
            <h2>Areas ({areas.length}):</h2>
            <p>{areaDuplicates.length} areas with duplicates</p>
            <p>{areaSimilar.length} areas with similar names</p>
            <p>
              Most climbed area:{' '}
              {Object.entries(areaFrequency)
                .map(([area, count]) => [area, count])
                .sort(([_a, a], [_b, b]) => {
                  if (typeof a === 'number' && typeof b === 'number')
                    return b - a
                  return 0
                })[0]
                ?.join(' - ')}{' '}
              climbs
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
