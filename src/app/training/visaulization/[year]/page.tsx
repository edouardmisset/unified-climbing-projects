import { YearGrid } from '~/app/_components/year-grid/year-grid'

import Color from 'colorjs.io'
import Link from 'next/link'
import { useMemo } from 'react'
import { seasonTraining } from '~/data/training-data'
import {
  convertSessionTypeToBackgroundColor,
  convertSessionTypeToForeColor,
  getTrainingSessionColorVariant,
} from '~/helpers/converter'
import { createTrainingQRTooltip } from '~/helpers/tooltips'

export default function Visualization({
  params: { year },
}: {
  params: { year: string }
}) {
  const numberYear = Number(year)
  const yearSession = seasonTraining[numberYear]

  const isDataPresentForPreviousYear = Boolean(seasonTraining[numberYear - 1])
  const isDataPresentForNextYear = Boolean(seasonTraining[numberYear + 1])

  const nextYear = numberYear + 1
  const previousYear = numberYear - 1

  const sessionsDescriptions = useMemo(
    () =>
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
      }) ?? [],
    [yearSession],
  )

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
