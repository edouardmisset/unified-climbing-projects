import { createYearList } from '~/data/helpers'
import { getIndicatorsForYear } from '~/helpers/get-indicators-for-year'
import { getAllAscents } from '~/services/ascents'
import { getAllTrainingSessions } from '~/services/training'
import { Event } from '../_components/timeline/event'
import { Timeline } from '../_components/timeline/timeline'
import styles from './page.module.css'

export async function IndicatorsTimeline() {
  const indicators = await getIndicators()

  return (
    <Timeline>
      {indicators.map(({ year, progression, efficiency, versatility, score }) => (
        <Event interval={String(year)} key={year} title={''}>
          <ul className={styles.list}>
            <li className={`${styles.item} textNoWrap`}>Progression: {progression}%</li>
            <li className={`${styles.item} textNoWrap`}>Efficiency: {efficiency}%</li>
            <li className={`${styles.item} textNoWrap`}>Versatility: {versatility}%</li>
            <hr className={styles.hr} />
            <li className={`${styles.item} textNoWrap`}>
              <strong>Score</strong>: {score}
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
