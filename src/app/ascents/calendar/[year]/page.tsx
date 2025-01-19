import { YearGrid } from '~/app/_components/year-grid/year-grid'

import { validNumberWithFallback } from '@edouardmisset/math/is-valid.ts'
import { Spacer } from '~/app/_components/spacer/spacer'
import { YearNavigationButton } from '~/app/_components/year-navigation-button/year-navigation-button'
import { getYearAscentPerDay } from '~/data/ascent-data'
import { fromGradeToBackgroundColor } from '~/helpers/converter'
import { formatDateTime } from '~/helpers/date'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { createAscentsQRTooltip } from '~/helpers/tooltips'
import { api } from '~/trpc/server'
import styles from './page.module.css'

export default async function AscentCalendar(props: {
  params: Promise<{ year: string }>
}) {
  const year = validNumberWithFallback(
    (await props.params).year,
    new Date().getFullYear(),
  )

  const allAscents = await api.ascents.getAllAscents()

  const yearlyAscents = getYearAscentPerDay(allAscents)
  const yearAscents = yearlyAscents[year]

  const isDataPresentForPreviousYear = Boolean(yearlyAscents[year - 1])
  const isDataPresentForNextYear = Boolean(yearlyAscents[year + 1])

  const ascentsDescriptions =
    yearAscents?.map(ascentDay => {
      const { date, ascents } = ascentDay

      if (ascents === undefined)
        return {
          date,
          shortText: '',
          tooltip: formatDateTime(new Date(date), 'shortDate'),
        }

      const hardestAscent = getHardestAscent(ascents)

      const backgroundColor = fromGradeToBackgroundColor(
        hardestAscent.topoGrade,
      )
      return {
        date,
        backgroundColor,
        tooltip: createAscentsQRTooltip(ascentDay.ascents),
        shortText: hardestAscent.topoGrade,
      }
    }) ?? []

  if (yearAscents === undefined) return <div>Year not found</div>

  return (
    <>
      <h1 className="center-text">Ascents in {year}</h1>
      <Spacer size={3} />
      <div className={styles.container}>
        <YearNavigationButton
          currentYear={year}
          nextOrPrevious="previous"
          enabled={isDataPresentForPreviousYear}
        />

        {yearAscents.length === 0 ? (
          <span>No record</span>
        ) : (
          <div className={styles.calendarContainer}>
            <YearGrid year={year} dayCollection={ascentsDescriptions} />
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
