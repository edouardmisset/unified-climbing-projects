import { api } from '~/trpc/server'
import { AreaSummary } from './_components/areas-summary/areas-summary.tsx'
import { AscentsSummary } from './_components/ascents-summary/ascents-summary.tsx'
import { Card } from './_components/card/card.tsx'
import { CragSummary } from './_components/crags-summary/crags-summary.tsx'
import { GradeSummary } from './_components/grades-summary/grades-summary.tsx'
import styles from './index.module.css'

const searchedRouteName = 'no'

export default async function Home() {
  // Areas
  const areasPromise = api.areas.getAllAreas()
  const areaDuplicatesPromise = api.areas.getDuplicates()
  const areaSimilarPromise = api.areas.getSimilar()
  const areaFrequencyPromise = api.areas.getFrequency()
  // Crags
  const cragsPromise = api.crags.getAllCrags()
  const cragDuplicatesPromise = api.crags.getDuplicate()
  const cragSimilarPromise = api.crags.getSimilar()
  const cragFrequencyPromise = api.crags.getFrequency()
  // Ascents
  const ascentsPromise = api.ascents.getAllAscents({
    descending: true,
  })
  const duplicateAscentsPromise = api.ascents.getDuplicates()
  const similarAscentsPromise = api.ascents.getSimilar()
  const searchedAscentsPromise = api.ascents.search({
    query: searchedRouteName,
  })
  // Grades
  const gradesPromise = api.grades.getAllGrades()
  const gradeAveragePromise = api.grades.getAverage()
  const gradeFrequencyPromise = api.grades.getFrequency()

  const [
    areas,
    areaDuplicates,
    areaSimilar,
    areaFrequency,
    crags,
    cragDuplicates,
    cragSimilar,
    cragFrequency,
    ascents,
    duplicateAscents,
    similarAscents,
    searchedAscents,
    grades,
    gradeAverage,
    gradeFrequency,
  ] = await Promise.all([
    areasPromise,
    areaDuplicatesPromise,
    areaSimilarPromise,
    areaFrequencyPromise,
    cragsPromise,
    cragDuplicatesPromise,
    cragSimilarPromise,
    cragFrequencyPromise,
    ascentsPromise,
    duplicateAscentsPromise,
    similarAscentsPromise,
    searchedAscentsPromise,
    gradesPromise,
    gradeAveragePromise,
    gradeFrequencyPromise,
  ])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to my climbing app</h1>
      <div className={styles.grid}>
        <Card>
          <AscentsSummary
            ascents={ascents}
            duplicateAscents={duplicateAscents}
            similarAscents={similarAscents}
            searchedAscents={searchedAscents}
            searchedRouteName={searchedRouteName}
          />
        </Card>
        <Card>
          <CragSummary
            cragDuplicates={cragDuplicates}
            cragFrequency={cragFrequency}
            cragSimilar={cragSimilar}
            crags={crags}
          />
        </Card>
        <Card>
          <GradeSummary
            gradeAverage={gradeAverage}
            gradeFrequency={gradeFrequency}
            grades={grades}
            ascents={ascents}
          />
        </Card>
        <Card>
          <AreaSummary
            areaDuplicates={areaDuplicates}
            areaFrequency={areaFrequency}
            areaSimilar={areaSimilar}
            areas={areas}
          />
        </Card>
      </div>
    </div>
  )
}
