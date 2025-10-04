import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'
import Layout from '../_components/page-layout/page-layout'
import { Event, Timeline } from '../_components/timeline/timeline'
import styles from './page.module.css'

export default async function Page() {
  const indicators = await getIndicators()
  return (
    <Layout
      gridClassName={styles.container}
      layout="flexRow"
      title="Indicators"
    >
      <Timeline direction="vertical">
        {indicators.map(
          ({ year, progression, efficiency, versatility, score }) => (
            <Event interval={String(year)} key={year} title={''}>
              <ul className={styles.list}>
                <li className={styles.item}>Progression: {progression}%</li>
                <li className={styles.item}>Efficiency: {efficiency}%</li>
                <li className={styles.item}>Versatility: {versatility}%</li>
                <hr className={styles.hr} />
                <li className={styles.item}>
                  <strong>Score</strong>: {score}
                </li>
              </ul>
            </Event>
          ),
        )}
      </Timeline>
    </Layout>
  )
}

async function getIndicators() {
  const allAscents = await api.ascents.getAll()
  const years = createYearList(allAscents, {
    continuous: false,
    descending: true,
  })
  return await Promise.all(
    years.map(async year => {
      const results = await Promise.all([
        api.indicators.getProgressionPercentage({ year }),
        api.indicators.getEfficiencyPercentage({ year }),
        api.indicators.getVersatilityPercentage({ year }),
        api.indicators.getScore({ year }),
      ])

      return {
        efficiency: results[1],
        progression: results[0],
        score: results[3],
        versatility: results[2],
        year,
      }
    }),
  )
}
