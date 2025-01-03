import { YearGrid } from '~/app/_components/year-grid/year-grid'

import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { Spacer } from '~/app/_components/spacer/spacer'
import { YearNavigationButton } from '~/app/_components/year-navigation-button/year-navigation-button'
import { getYearTraining } from '~/data/training-data'
import {
  fromSessionTypeToForeColor,
  getSessionTypeColorVariant,
} from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'
import styles from './page.module.css'

export default async function TrainingCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const trainingSessions = await api.training.getAllTrainingSessions()

  const yearSession = getYearTraining(trainingSessions)[year]

  const isDataPresentForPreviousYear = Boolean(
    getYearTraining(trainingSessions)[year - 1],
  )
  const isDataPresentForNextYear = Boolean(
    getYearTraining(trainingSessions)[year + 1],
  )

  const sessionsDescriptions =
    yearSession?.map(session => {
      const { date, sessionType } = session
      const backgroundColor = getSessionTypeColorVariant({
        sessionType,
        intensityPercent: session?.intensity,
        volumePercent: session?.volume,
      })
      return {
        date,
        backgroundColor,
        tooltip: createTrainingQRTooltip(session),
        foreColor: fromSessionTypeToForeColor(sessionType).toString(),
        shortText: sessionType,
      }
    }) ?? []

  if (yearSession === undefined) return <div>Year not found</div>

  return (
    <>
      <h1
        className="center-text"
        style={{
          marginInline: 'auto',
        }}
      >
        Training in {year}
      </h1>
      <Spacer size={3} />
      <div className={styles.container}>
        <YearNavigationButton
          currentYear={year}
          nextOrPrevious="previous"
          enabled={isDataPresentForPreviousYear}
        />

        {yearSession.length === 0 ? (
          <span>No record</span>
        ) : (
          <div className={styles.calendarContainer}>
            <YearGrid year={year} dayCollection={sessionsDescriptions} />
          </div>
        )}
        <YearNavigationButton
          currentYear={year}
          nextOrPrevious="next"
          enabled={isDataPresentForNextYear}
        />
      </div>
    </>
  )
}
