import { describe, expect, it } from 'vite-plus/test'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { QueryProvider } from '~/app/_components/query-provider/query-provider'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import { sampleAscents, sampleTrainingSessions } from '~/testing/sample-data'
import { CalendarYear } from './calendar-year'
import { DataCalendar } from './data-calendar'
import styles from './data-calendar.module.css'

const YEAR = 2_026
const VISUAL_STYLE = { width: 1_100 }
const MIN_READABLE_CELL_SIZE = 16

describe('calendar visual regression', () => {
  it('matches the ascent calendar baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <DataCalendar
          data={sampleAscents}
          dataTransformationFunction={groupDataDaysByYear}
          fromDataToCalendarEntries={fromAscentsToCalendarEntries}
          year={YEAR}
        />
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('ascent-calendar.png')
  })

  it('matches the training calendar baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <DataCalendar
          data={sampleTrainingSessions}
          dataTransformationFunction={groupDataDaysByYear}
          fromDataToCalendarEntries={(year, sessions) =>
            fromTrainingSessionsToCalendarEntries(year, sessions, sampleAscents)
          }
          year={YEAR}
        />
      </div>,
      { wrapper: QueryProvider },
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('training-calendar.png')
  })

  it('shows only the latest year and scales square cells in phone landscape', async () => {
    await page.viewport(844, 390)

    const { container } = await render(
      <div className={styles.calendarPage}>
        <CalendarYear isLatestYear year={YEAR}>
          <h2>{YEAR}</h2>
          <DataCalendar
            data={sampleAscents}
            dataTransformationFunction={groupDataDaysByYear}
            fromDataToCalendarEntries={fromAscentsToCalendarEntries}
            year={YEAR}
          />
        </CalendarYear>
        <CalendarYear isLatestYear={false} year={YEAR - 1}>
          <h2>{YEAR - 1}</h2>
          <DataCalendar
            data={sampleAscents}
            dataTransformationFunction={groupDataDaysByYear}
            fromDataToCalendarEntries={fromAscentsToCalendarEntries}
            year={YEAR - 1}
          />
        </CalendarYear>
      </div>,
    )

    const latestYear = container.querySelector('[data-latest-year="true"]')
    const historicalYear = container.querySelector('[data-latest-year="false"]')
    const cell = latestYear?.querySelector('button')

    expect(latestYear).not.toBeNull()
    expect(historicalYear).not.toBeNull()
    expect(latestYear ? getComputedStyle(latestYear).display : '').not.toBe('none')
    expect(historicalYear ? getComputedStyle(historicalYear).display : '').toBe('none')
    expect(cell).not.toBeNull()

    const { height, width } = cell?.getBoundingClientRect() ?? { height: 0, width: 0 }
    expect(width).toBeGreaterThan(MIN_READABLE_CELL_SIZE)
    expect(Math.abs(width - height)).toBeLessThanOrEqual(1)
  })
})
