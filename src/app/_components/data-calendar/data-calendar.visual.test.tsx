import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { QueryProvider } from '~/app/_components/query-provider/query-provider'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromAscentsToCalendarEntries } from '~/helpers/ascent-calendar-helpers'
import { fromTrainingSessionsToCalendarEntries } from '~/helpers/training-calendar-helpers'
import { sampleAscents, sampleTrainingSessions } from '~/testing/sample-data'
import { DataCalendar } from './data-calendar'

const YEAR = 2_026
const VISUAL_STYLE = { width: 1_100 }

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
})
