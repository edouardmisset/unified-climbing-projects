'use client'

import { Link } from 'next-view-transitions'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter.ts'
import { useGetAscents } from '~/hooks/use-get-ascents.ts'
import { Card } from '../card/card.tsx'
import { AscentsByGradesPerCrag } from '../charts/ascents-by-grades-per-crag/ascents-by-grades-per-crag.tsx'
import { AscentsByStyle } from '../charts/ascents-by-style/ascents-by-style.tsx'
import { AscentsPerDiscipline } from '../charts/ascents-per-discipline/ascents-per-discipline.tsx'
import { AscentsPerDisciplinePerGrade } from '../charts/ascents-per-discipline-per-grade/ascents-per-discipline-per-grade.tsx'
import { AscentsPerDisciplinePerYear } from '../charts/ascents-per-discipline-per-year/ascents-per-discipline-per-year.tsx'
import { AscentsPerYearByGrade } from '../charts/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx'
import { AscentPyramid } from '../charts/ascents-pyramid/ascent-pyramid.tsx'
import { DistanceClimbedPerYear } from '../charts/distance-climbed/distance-climbed-per-year.tsx'
import { TriesByGrade } from '../charts/tries-by-grade/tries-by-grade.tsx'
import { Loader } from '../loader/loader.tsx'
import styles from './dashboard.module.css'

export function Dashboard() {
  const { data: allAscents = [], isLoading } = useGetAscents()

  const filteredAscents = useAscentsFilter(allAscents)

  if (isLoading) return <Loader />

  if (!allAscents) return <NotFound />

  return (
    <div className="flex flex-column gap align-center grid-full-width">
      <AscentsFilterBar allAscents={allAscents} />
      {filteredAscents.length === 0 ? (
        <div className=" flex-column gap w100 padding">
          <h2>Nothing there...</h2>
          <p>
            Try adjusting your filters or{' '}
            <Link href={'/log-ascent'}>logging new ascents</Link>.
          </p>
        </div>
      ) : (
        <div className={styles.container}>
          <Card>
            {' '}
            <AscentPyramid ascents={filteredAscents} className={styles.item} />
          </Card>
          <Card>
            <AscentsPerYearByGrade
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
          <Card>
            <AscentsByStyle ascents={filteredAscents} className={styles.item} />
          </Card>
          <Card>
            <AscentsPerDiscipline
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
          <Card>
            <AscentsPerDisciplinePerYear
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
          <Card>
            <TriesByGrade ascents={filteredAscents} className={styles.item} />
          </Card>
          <Card>
            <AscentsPerDisciplinePerGrade
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
          <Card>
            <DistanceClimbedPerYear
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
          <Card>
            <AscentsByGradesPerCrag
              ascents={filteredAscents}
              className={styles.item}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
