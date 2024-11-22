import { YearGrid } from '~/app/_components/year-grid/year-grid'

import Color from 'colorjs.io'
import { Spacer } from '~/app/_components/spacer/spacer'
import { YearNavigationButton } from '~/app/_components/year-navigation-button/year-navigation-button'
import { getSeasonTraining } from '~/data/training-data'
import {
  convertSessionTypeToBackgroundColor,
  convertSessionTypeToForeColor,
  getTrainingSessionColorVariant,
} from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function TrainingCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const { year } = await props.params

  const trainingSessions = await api.training.getAllTrainingSessions()

  const numberYear = Number(year)
  const yearSession = getSeasonTraining(trainingSessions)[numberYear]

  const isDataPresentForPreviousYear = Boolean(
    getSeasonTraining(trainingSessions)[numberYear - 1],
  )
  const isDataPresentForNextYear = Boolean(
    getSeasonTraining(trainingSessions)[numberYear + 1],
  )

  const sessionsDescriptions =
    yearSession?.map(session => {
      const { date, sessionType } = session
      const backgroundColor =
        sessionType === undefined
          ? 'hsla(0deg 0% 100% / 0.3)'
          : getTrainingSessionColorVariant(
              new Color(convertSessionTypeToBackgroundColor(sessionType)).to(
                'oklch',
              ),
              session?.intensity ?? 65,
              session?.volume ?? 65,
            ).toString()
      return {
        date,
        backgroundColor,
        tooltip: createTrainingQRTooltip(session),
        foreColor: convertSessionTypeToForeColor(sessionType).toString(),
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
      <div className="flex-row space-between">
        <YearNavigationButton
          currentYear={numberYear}
          nextOrPrevious="previous"
          enabled={isDataPresentForPreviousYear}
        />

        {yearSession.length === 0 ? (
          <span>No record</span>
        ) : (
          <YearGrid year={numberYear} dayCollection={sessionsDescriptions} />
        )}
        <YearNavigationButton
          currentYear={numberYear}
          nextOrPrevious="next"
          enabled={isDataPresentForNextYear}
        />
      </div>
    </>
  )
}
