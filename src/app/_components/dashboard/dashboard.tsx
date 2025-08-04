'use client'

import { Link } from 'next-view-transitions'
import { memo, Suspense } from 'react'
import AscentsFilterBar from '~/app/_components/filter-bar/_components/ascents-filter-bar.tsx'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter.ts'
import type { AscentListProps } from '~/schema/ascent.ts'
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

export function Dashboard({ ascents }: AscentListProps) {
  const filteredAscents = useAscentsFilter(ascents)

  if (ascents.length === 0) return <NotFound />

  return (
    <div className="flex flexColumn alignCenter gridFullWidth">
      <AscentsFilterBar allAscents={ascents} />
      <Suspense fallback={<Loader />}>
        <DashboardStatistics ascents={filteredAscents} />
      </Suspense>
    </div>
  )
}

const DashboardStatistics = memo(({ ascents }: AscentListProps) => {
  if (ascents.length === 0) {
    return (
      <div className=" flexColumn gap w100 padding">
        <h2>Nothing there...</h2>
        <p>
          Try adjusting your filters or{' '}
          <Link href={'/log-ascent'}>logging new ascents</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <AscentPyramid ascents={ascents} className={styles.item} />
      <AscentsPerYearByGrade ascents={ascents} className={styles.item} />
      <AscentsByStyle ascents={ascents} className={styles.item} />
      <AscentsPerDiscipline ascents={ascents} className={styles.item} />
      <AscentsPerDisciplinePerYear ascents={ascents} className={styles.item} />
      <TriesByGrade ascents={ascents} className={styles.item} />
      <AscentsPerDisciplinePerGrade ascents={ascents} className={styles.item} />
      <DistanceClimbedPerYear ascents={ascents} className={styles.item} />
      <AscentsByGradesPerCrag ascents={ascents} className={styles.item} />
    </div>
  )
})
