'use client'

import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import NotFound from '~/app/not-found.tsx'
import { useAscentsFilter } from '~/hooks/use-ascents-filter.ts'
import { api } from '~/trpc/react'
import { AscentsByStyle } from '../graphs/ascents-by-style/ascents-by-style.tsx'
import { AscentsPerYearByGrade } from '../graphs/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx'
import { AscentPyramid } from '../graphs/ascents-pyramid/ascent-pyramid.tsx'
import { RoutesVsBouldersPerYear } from '../graphs/routes-vs-boulders-per-year/routes-vs-boulders-per-year.tsx'
import { RoutesVsBoulders } from '../graphs/routes-vs-boulders/routes-vs-boulders.tsx'
import { Loader } from '../loader/loader.tsx'
import styles from './dashboard.module.css'

export function Dashboard() {
  const [allAscents, { isLoading }] =
    api.ascents.getAllAscents.useSuspenseQuery()

  const filteredAscents = useAscentsFilter(allAscents)

  if (isLoading) return <Loader />
  if (!allAscents) return <NotFound />

  return (
    <>
      <AscentsFilterBar allAscents={allAscents} />
      <div className={styles.container}>
        <div className={styles.item}>
          <AscentPyramid ascents={filteredAscents} />
        </div>
        <div className={styles.item}>
          <AscentsPerYearByGrade ascents={filteredAscents} />
        </div>
        <div className={styles.item}>
          <AscentsByStyle ascents={filteredAscents} />
        </div>
        <div className={styles.item}>
          <RoutesVsBoulders ascents={filteredAscents} />
        </div>
        <div className={styles.item}>
          <RoutesVsBouldersPerYear ascents={filteredAscents} />
        </div>
      </div>
    </>
  )
}
