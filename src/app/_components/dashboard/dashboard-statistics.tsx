import dynamic from 'next/dynamic'
import { Link } from 'next-view-transitions'
import { memo } from 'react'
import { LINKS } from '~/constants/links'
import type { AscentListProps } from '~/schema/ascent.ts'
import styles from './dashboard.module.css'

const AscentsByGradesPerCrag = dynamic(
  () =>
    import('../charts/ascents-by-grades-per-crag/ascents-by-grades-per-crag.tsx').then(
      m => m.AscentsByGradesPerCrag,
    ),
  { ssr: false },
)
const AscentsByStyle = dynamic(
  () => import('../charts/ascents-by-style/ascents-by-style.tsx').then(m => m.AscentsByStyle),
  { ssr: false },
)
const AscentsPerDiscipline = dynamic(
  () =>
    import('../charts/ascents-per-discipline/ascents-per-discipline.tsx').then(
      m => m.AscentsPerDiscipline,
    ),
  { ssr: false },
)
const AscentsPerDisciplinePerGrade = dynamic(
  () =>
    import('../charts/ascents-per-discipline-per-grade/ascents-per-discipline-per-grade.tsx').then(
      m => m.AscentsPerDisciplinePerGrade,
    ),
  { ssr: false },
)
const AscentsPerDisciplinePerYear = dynamic(
  () =>
    import('../charts/ascents-per-discipline-per-year/ascents-per-discipline-per-year.tsx').then(
      m => m.AscentsPerDisciplinePerYear,
    ),
  { ssr: false },
)
const AscentsPerYearByGrade = dynamic(
  () =>
    import('../charts/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx').then(
      m => m.AscentsPerYearByGrade,
    ),
  { ssr: false },
)
const AscentPyramid = dynamic(
  () => import('../charts/ascents-pyramid/ascent-pyramid.tsx').then(m => m.AscentPyramid),
  { ssr: false },
)
const DistanceClimbedPerYear = dynamic(
  () =>
    import('../charts/distance-climbed/distance-climbed-per-year.tsx').then(
      m => m.DistanceClimbedPerYear,
    ),
  { ssr: false },
)
const TriesByGrade = dynamic(
  () => import('../charts/tries-by-grade/tries-by-grade.tsx').then(m => m.TriesByGrade),
  { ssr: false },
)

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
