import { api } from '~/trpc/server'
import { AscentsSummary } from './_components/ascents-summary/ascents-summary.tsx'
import { Card } from './_components/card/card.tsx'
import { CragSummary } from './_components/crags-summary/crags-summary.tsx'
import { GradeSummary } from './_components/grades-summary/grades-summary.tsx'
import styles from './index.module.css'

const searchedRouteName = 'no'

async function fetchClimbingData() {
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
  ] = await Promise.all([
    api.areas.getAllAreas(),
    api.areas.getDuplicates(),
    api.areas.getSimilar(),
    api.areas.getFrequency(),
    api.crags.getAllCrags(),
    api.crags.getDuplicate(),
    api.crags.getSimilar(),
    api.crags.getFrequency(),
    api.ascents.getAllAscents({
      descending: true,
    }),
    api.ascents.getDuplicates(),
    api.ascents.getSimilar(),
    api.ascents.search({
      query: searchedRouteName,
    }),
    api.grades.getAllGrades(),
    api.grades.getAverage(),
  ])
  return {
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
  }
}

export default async function Home() {
  const {
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
  } = await fetchClimbingData()

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
            grades={grades}
            ascents={ascents}
          />
        </Card>
      </div>
    </div>
  )
}
