import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { sampleAscents } from '~/testing/sample-data'
import { DataCalendar } from './data-calendar'

describe('dataCalendar', () => {
  it('renders one square per populated day, graded and colored by its hardest ascent', async () => {
    const year = new Date(sampleAscents[0]?.date ?? '').getFullYear()
    const dayAscents = groupDataDaysByYear(sampleAscents)[year]
    const entries = fromAscentsToCalendarEntries(year, dayAscents)
    const populatedEntries = entries.filter(entry => entry.ascents !== undefined)

    const { container } = await render(
      <DataCalendar
        data={sampleAscents}
        dataTransformationFunction={groupDataDaysByYear}
        fromDataToCalendarEntries={fromAscentsToCalendarEntries}
        year={year}
      />,
    )

    expect(populatedEntries.length).toBeGreaterThan(0)
    await expect
      .poll(() => container.querySelectorAll('button').length)
      .toBe(populatedEntries.length)

    const buttons = [...container.querySelectorAll('button')]
    populatedEntries.forEach((entry, index) => {
      const button = buttons[index]

      expect(button?.textContent).toBe(entry.shortText)
      expect(button?.style.backgroundColor).toBe(entry.backgroundColor)
    })
  })
})
