import { describe, expect, it } from 'vite-plus/test'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { sampleAscents } from '~/testing/sample-data'
import { CalendarYear } from './calendar-year'
import { DataCalendar } from './data-calendar'
import styles from './data-calendar.module.css'

const YEAR = 2_026
const DESKTOP_VIEWPORT = { height: 720, width: 1_280 }
const PHONE_LANDSCAPE_VIEWPORT = { height: 390, width: 844 }
const MIN_READABLE_CELL_SIZE = 16

describe('calendar phone landscape layout', () => {
  it('shows only the latest year and scales square cells', async () => {
    await page.viewport(PHONE_LANDSCAPE_VIEWPORT.width, PHONE_LANDSCAPE_VIEWPORT.height)

    try {
      expect(window.innerWidth).toBe(PHONE_LANDSCAPE_VIEWPORT.width)
      expect(window.innerHeight).toBe(PHONE_LANDSCAPE_VIEWPORT.height)

      const { container } = await render(
        <div className={styles.calendarPage} data-testid='calendar'>
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
    } finally {
      await page.viewport(DESKTOP_VIEWPORT.width, DESKTOP_VIEWPORT.height)
    }
  })
})
