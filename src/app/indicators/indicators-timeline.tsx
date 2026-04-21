import { createYearList } from '~/shared/data/helpers'
import { getIndicatorsForYear } from '~/indicators/helpers/get-indicators-for-year'
import { formatNumber, formatWholePercent } from '~/shared/helpers/number-formatter'
import { getAllAscents } from '~/ascents/services'
import { getAllTrainingSessions } from '~/training/services'
import { Event } from '~/shared/components/timeline/event'
import { Timeline } from '~/shared/components/timeline/timeline'
import styles from './page.module.css'

export async function IndicatorsTimeline() {
  const indicators = await getIndicators()

  return (
    <Timeline>
      {indicators.map(({ year, progression, efficiency, versatility, score }) => (
        <Event interval={String(year)} key={year} title=''>
          <ul className={styles.list}>
            <li className={`${styles.item} textNoWrap`}>
              Progression: {formatWholePercent(progression)}
            </li>
            <li className={`${styles.item} textNoWrap`}>
              Efficiency: {formatWholePercent(efficiency)}
            </li>
            <li className={`${styles.item} textNoWrap`}>
              Versatility: {formatWholePercent(versatility)}
            </li>
            <hr className={styles.hr} />
            <li className={`${styles.item} textNoWrap`}>
              <strong>Score</strong>: {formatNumber(score)}
            </li>
          </ul>
        </Event>
      ))}
    </Timeline>
  )
}

async function getIndicators() {
  const [allAscents, allTrainingSessions] = await Promise.all([
    getAllAscents(),
    getAllTrainingSessions(),
  ])

  const years = createYearList(allAscents, {
    continuous: false,
    descending: true,
  })

  return years.map(year =>
    getIndicatorsForYear({
      allAscents,
      allTrainingSessions,
      year,
    }),
  )
}
