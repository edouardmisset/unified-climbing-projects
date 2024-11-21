import { YearGrid } from '~/app/_components/year-grid/year-grid'

import Color from 'colorjs.io'
import Link from 'next/link'
import { getSeasonTraining } from '~/data/training-data'
import {
  convertSessionTypeToBackgroundColor,
  convertSessionTypeToForeColor,
  getTrainingSessionColorVariant,
} from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'

export default async function Visualization(props: {
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

  const nextYear = numberYear + 1
  const previousYear = numberYear - 1

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
      <div className="center-text">An overview of my training in {year}</div>
      <div
        className="flex-row space-between"
        style={{
          paddingInline: '1rem',
        }}
      >
        {isDataPresentForPreviousYear ? (
          <Link className="btn" href={`./${previousYear}`}>
            {`< ${previousYear}`}
          </Link>
        ) : (
          <span />
        )}

        {yearSession.length === 0 ? (
          <span>No record</span>
        ) : (
          <YearGrid year={numberYear} dayCollection={sessionsDescriptions} />
        )}
        {isDataPresentForNextYear ? (
          <Link className="btn" href={`./${nextYear}`}>
            {`${nextYear} >`}
          </Link>
        ) : (
          <span />
        )}
      </div>
    </>
  )
}
