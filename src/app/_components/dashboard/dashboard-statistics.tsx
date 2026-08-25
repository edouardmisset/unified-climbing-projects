import dynamic from 'next/dynamic'
import Link from 'next/link'

import { LINKS } from '~/constants/links'
import type { AscentListProps } from '~/schema/ascent.ts'
import styles from './dashboard.module.css'

const AnimatedAscentPyramid = dynamic(
  async () =>
    import('../charts/animated-crag-race/animated-crag-race.tsx').then(
      m => m.AnimatedAscentPyramid,
    ),
  { ssr: false },
)
const AnimatedCragRace = dynamic(
  async () =>
    import('../charts/animated-crag-race/animated-crag-race.tsx').then(m => m.AnimatedCragRace),
  { ssr: false },
)
const AscentsByStyle = dynamic(
  async () => import('../charts/ascents-by-style/ascents-by-style.tsx').then(m => m.AscentsByStyle),
  { ssr: false },
)
const AscentsPerDiscipline = dynamic(
  async () =>
    import('../charts/ascents-per-discipline/ascents-per-discipline.tsx').then(
      m => m.AscentsPerDiscipline,
    ),
  { ssr: false },
)
const AscentsPerDisciplinePerGrade = dynamic(
  async () =>
    import('../charts/ascents-per-discipline-per-grade/ascents-per-discipline-per-grade.tsx').then(
      m => m.AscentsPerDisciplinePerGrade,
    ),
  { ssr: false },
)
const AscentsVolumeAndGradesPerYear = dynamic(
  async () =>
    import('../charts/ascents-volume-and-grades-per-year/ascents-volume-and-grades-per-year.tsx').then(
      m => m.AscentsVolumeAndGradesPerYear,
    ),
  { ssr: false },
)
const AscentsPerYearByGrade = dynamic(
  async () =>
    import('../charts/ascents-per-year-by-grade/ascents-per-year-by-grade.tsx').then(
      m => m.AscentsPerYearByGrade,
    ),
  { ssr: false },
)
const DistanceClimbedPerYear = dynamic(
  async () =>
    import('../charts/distance-climbed/distance-climbed-per-year.tsx').then(
      m => m.DistanceClimbedPerYear,
    ),
  { ssr: false },
)
const TopTenEvolution = dynamic(
  async () =>
    import('../charts/top-ten-evolution/top-ten-evolution.tsx').then(m => m.TopTenEvolution),
  { ssr: false },
)
const TriesByGrade = dynamic(
  async () => import('../charts/tries-by-grade/tries-by-grade.tsx').then(m => m.TriesByGrade),
  { ssr: false },
)

type DashboardStatisticsProps = AscentListProps

function DashboardStatisticsComponent(props: DashboardStatisticsProps) {
  const { ascents } = props
  const filteredAscentKey = ascents.map(({ _id }) => _id).join('|')

  if (ascents.length === 0)
    return (
      <div className=' flexColumn gap w100 padding'>
        <h2>Nothing there...</h2>
        <p>
          Try adjusting your filters or <Link href={LINKS.log}>logging new ascents</Link>.
        </p>
      </div>
    )

  return (
    <div className={styles.container}>
      <AnimatedAscentPyramid ascents={ascents} key={`pyramid:${filteredAscentKey}`} />
      <AscentsPerYearByGrade ascents={ascents} />
      <AscentsByStyle ascents={ascents} />
      <AscentsPerDiscipline ascents={ascents} />
      <AscentsVolumeAndGradesPerYear ascents={ascents} />
      <TriesByGrade ascents={ascents} />
      <AscentsPerDisciplinePerGrade ascents={ascents} />
      <DistanceClimbedPerYear ascents={ascents} />
      <AnimatedCragRace ascents={ascents} key={`crag:${filteredAscentKey}`} />
      <TopTenEvolution ascents={ascents} />
    </div>
  )
}

export const DashboardStatistics = DashboardStatisticsComponent
