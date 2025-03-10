'use client'

import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import NotFound from '~/app/not-found'
import { useAscentsFilter } from '~/hooks/use-ascents-filter.ts'
import { api } from '~/trpc/react'
import { AscentsByStyle } from '../charts/ascents-by-style/ascents-by-style.tsx'
import { AscentsPerYearByGrade } from '../charts/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx'
import { AscentPyramid } from '../charts/ascents-pyramid/ascent-pyramid.tsx'
import { RoutesVsBouldersPerYear } from '../charts/routes-vs-boulders-per-year/routes-vs-boulders-per-year.tsx'
import { RoutesVsBoulders } from '../charts/routes-vs-boulders/routes-vs-boulders.tsx'
import { TriesByGrade } from '../charts/tries-by-grade/tries-by-grade.tsx'
import { Loader } from '../loader/loader.tsx'
import styles from './dashboard.module.css'

export function Dashboard() {
  const { data: allAscents, isLoading } = api.ascents.getAllAscents.useQuery()

  const filteredAscents = useAscentsFilter(allAscents ?? [])

  if (isLoading) return <Loader />

  if (!allAscents) return <NotFound />

  return (
    <>
      <AscentsFilterBar allAscents={allAscents} />
      <div className={styles.container}>
        <AscentPyramid ascents={filteredAscents} className={styles.item} />
        <AscentsPerYearByGrade
          ascents={filteredAscents}
          className={styles.item}
        />
        <AscentsByStyle ascents={filteredAscents} className={styles.item} />
        <RoutesVsBoulders ascents={filteredAscents} className={styles.item} />
        <RoutesVsBouldersPerYear
          ascents={filteredAscents}
          className={styles.item}
        />
        <TriesByGrade ascents={filteredAscents} className={styles.item} />
      </div>
    </>
  )
}
