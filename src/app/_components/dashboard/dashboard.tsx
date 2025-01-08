'use client'

import { useQueryState } from 'nuqs'
import AscentsFilterBar from '~/app/_components/ascents-filter-bar/ascents-filter-bar'
import { filterAscents } from '~/helpers/filter-ascents.ts'
import {
  type Ascent,
  ascentStyleSchema,
  climbingDisciplineSchema,
  gradeSchema,
} from '~/schema/ascent'
import { api } from '~/trpc/react'
import { AscentsByStyle } from '../graphs/ascents-by-style/ascents-by-style.tsx'
import { AscentsPerYearByGrade } from '../graphs/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx'
import { AscentPyramid } from '../graphs/ascents-pyramid/ascent-pyramid.tsx'
import { RoutesVsBouldersPerYear } from '../graphs/routes-vs-boulders-per-year/routes-vs-boulders-per-year.tsx'
import { RoutesVsBoulders } from '../graphs/routes-vs-boulders/routes-vs-boulders.tsx'
import { ALL_VALUE } from './constants.ts'
import styles from './dashboard.module.css'
import type { OrAll } from './types.ts'

export function Dashboard() {
  const [selectedYear] = useQueryState<OrAll<number>>('year', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : Number(value)),
  })
  const [selectedDiscipline] = useQueryState<
    OrAll<Ascent['climbingDiscipline']>
  >('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : climbingDisciplineSchema.parse(value),
  })
  const [selectedStyle] = useQueryState<OrAll<Ascent['style']>>('style', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : ascentStyleSchema.parse(value),
  })
  const [selectedCrag] = useQueryState<OrAll<Ascent['crag']>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
  })
  const [selectedGrade] = useQueryState<OrAll<Ascent['topoGrade']>>('grade', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE ? ALL_VALUE : gradeSchema.parse(value),
  })

  const [allAscents, { isLoading }] =
    api.ascents.getAllAscents.useSuspenseQuery()

  if (!allAscents || isLoading) return <div>Loading...</div>

  const filteredAscents = filterAscents(allAscents, {
    year: selectedYear === ALL_VALUE ? undefined : Number(selectedYear),
    climbingDiscipline:
      selectedDiscipline === ALL_VALUE ? undefined : selectedDiscipline,
    style: selectedStyle === ALL_VALUE ? undefined : selectedStyle,
    crag: selectedCrag === ALL_VALUE ? undefined : selectedCrag,
    grade: selectedGrade === ALL_VALUE ? undefined : selectedGrade,
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
