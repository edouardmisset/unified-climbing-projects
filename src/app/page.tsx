import { api } from '~/trpc/server'
import { AreaSummary } from './_components/areas-summary/areas-summary'
import { AscentsSummary } from './_components/ascents-summary/ascents-summary'
import { Card } from './_components/card/card'
import { CragSummary } from './_components/crags-summary/crags-summary'
import { GradeSummary } from './_components/grades-summary/grades-summary'
import styles from './index.module.css'

const searchedRouteName = 'no'

export default async function Home() {
  // Areas
  const areas = await api.areas.getAllAreas()
  const areaDuplicates = await api.areas.getDuplicates()
  const areaSimilar = await api.areas.getSimilar()
  const areaFrequency = await api.areas.getFrequency()
  // Crags
  const crags = await api.crags.getAllCrags()
  const cragDuplicates = await api.crags.getDuplicate()
  const cragSimilar = await api.crags.getSimilar()
  const cragFrequency = await api.crags.getFrequency()
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
    </main>
  )
}
