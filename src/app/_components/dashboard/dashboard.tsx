'use client'

import { useQueryState } from 'nuqs'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import type { Ascent } from '~/schema/ascent'
import { api } from '~/trpc/react'
import { AscentsByStyle } from '../graphs/ascents-by-style/ascents-by-style.tsx'
import { AscentsPerYearByGrade } from '../graphs/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx'
import { AscentPyramid } from '../graphs/ascents-pyramid/ascent-pyramid.tsx'
import { RoutesVsBouldersPerYear } from '../graphs/routes-vs-boulders-per-year/routes-vs-boulders-per-year.tsx'
import { RoutesVsBoulders } from '../graphs/routes-vs-boulders/routes-vs-boulders.tsx'
import { ALL_VALUE } from './constants.ts'
import styles from './dashboard.module.css'

export function Dashboard() {
  const [selectedYear] = useQueryState('year', {
    defaultValue: ALL_VALUE,
  })
  const [selectedDiscipline] = useQueryState('discipline', {
    defaultValue: ALL_VALUE,
  })
  const [selectedStyle] = useQueryState('style', {
    defaultValue: ALL_VALUE,
  })
  const [selectedCrag] = useQueryState('crag', {
    defaultValue: ALL_VALUE,
  })
  const [selectedGrade] = useQueryState('grade', {
    defaultValue: ALL_VALUE,
  })
  const [selectedProfile] = useQueryState('profile', {
    defaultValue: ALL_VALUE,
  })
  const [selectedHolds] = useQueryState('holds', {
    defaultValue: ALL_VALUE,
  })
  const [selectedHeight] = useQueryState('height', {
    defaultValue: ALL_VALUE,
  })
  const [selectedTries] = useQueryState('tries', {
    defaultValue: ALL_VALUE,
  })
  const [selectedRating] = useQueryState('rating', {
    defaultValue: ALL_VALUE,
  })

  const [allAscents] = api.ascents.getAllAscents.useSuspenseQuery()

  if (!allAscents) return <div>Loading...</div>

  const filteredAscents = filterAscents(allAscents, {
    year: selectedYear === ALL_VALUE ? undefined : Number(selectedYear),
    climbingDiscipline:
      selectedDiscipline === ALL_VALUE
        ? undefined
        : (selectedDiscipline as Ascent['climbingDiscipline']),
    style:
      selectedStyle === ALL_VALUE
        ? undefined
        : (selectedStyle as Ascent['style']),
    crag:
      selectedCrag === ALL_VALUE ? undefined : (selectedCrag as Ascent['crag']),
    grade:
      selectedGrade === ALL_VALUE
        ? undefined
        : (selectedGrade as Ascent['topoGrade']),
    profile:
      selectedProfile === ALL_VALUE
        ? undefined
        : (selectedProfile as Ascent['profile']),
    holds:
      selectedHolds === ALL_VALUE
        ? undefined
        : (selectedHolds as Ascent['holds']),
    height: selectedHeight === ALL_VALUE ? undefined : Number(selectedHeight),
    tries: selectedTries === ALL_VALUE ? undefined : Number(selectedTries),
    rating: selectedRating === ALL_VALUE ? undefined : Number(selectedRating),
  })

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
