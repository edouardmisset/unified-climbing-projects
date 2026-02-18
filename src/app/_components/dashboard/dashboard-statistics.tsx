import { Link } from 'next-view-transitions'
import { memo } from 'react'
import { LINKS } from '~/constants/links'
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
import styles from './dashboard.module.css'

type DashboardStatisticsProps = AscentListProps

function DashboardStatisticsComponent(props: DashboardStatisticsProps) {
  const { ascents } = props

  if (ascents.length === 0) {
    return (
      <div className=' flexColumn gap w100 padding'>
        <h2>Nothing there...</h2>
        <p>
          Try adjusting your filters or <Link href={LINKS.ascentForm}>logging new ascents</Link>.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <AscentPyramid ascents={ascents} />
      <AscentsPerYearByGrade ascents={ascents} />
      <AscentsByStyle ascents={ascents} />
      <AscentsPerDiscipline ascents={ascents} />
      <AscentsPerDisciplinePerYear ascents={ascents} />
      <TriesByGrade ascents={ascents} />
      <AscentsPerDisciplinePerGrade ascents={ascents} />
      <DistanceClimbedPerYear ascents={ascents} />
      <AscentsByGradesPerCrag ascents={ascents} />
    </div>
  )
}

export const DashboardStatistics = memo(DashboardStatisticsComponent)
