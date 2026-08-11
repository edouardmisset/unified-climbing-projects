import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { QueryProvider } from '~/app/_components/query-provider/query-provider'
import { groupDataWeeksByYear } from '~/data/helpers'
import { fromSessionTypeToSortOrder } from '~/helpers/sorter'
import { fromSessionTypeToBackgroundColor } from '~/helpers/training-converter'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingSessionsBarcode } from './training-sessions-barcode'

const HALF = 2

describe('trainingSessionsBarcode', () => {
  it('renders one bar per populated week, sized and colored by its sessions', async () => {
    const year = new Date(sampleTrainingSessions[0]?.date ?? '').getFullYear()
    const yearlyTraining = groupDataWeeksByYear(sampleTrainingSessions)[year] ?? []
    const populatedWeeks = yearlyTraining.filter(week => week.length > 0)

    const { container } = await render(
      <TrainingSessionsBarcode yearlyTraining={yearlyTraining} />,
      {
        wrapper: QueryProvider,
      },
    )

    expect(populatedWeeks.length).toBeGreaterThan(0)
    await expect.poll(() => container.querySelectorAll('button').length).toBe(populatedWeeks.length)

    const buttons = [...container.querySelectorAll('button')]
    populatedWeeks.forEach((week, index) => {
      const button = buttons[index]
      const sortedByType = week
        .filter(Boolean)
        .toSorted(
          ({ type: aType }, { type: bType }) =>
            fromSessionTypeToSortOrder(bType) - fromSessionTypeToSortOrder(aType),
        )
      const expectedWidth = `${week.length / HALF}%`
      const expectedBackground =
        sortedByType.length <= 1
          ? undefined
          : `linear-gradient(to bottom in oklch, ${sortedByType
              .map(({ type }) => fromSessionTypeToBackgroundColor(type))
              .join(', ')})`

      expect(button?.style.inlineSize).toBe(expectedWidth)
      expect(button?.style.background === '' ? undefined : button?.style.background).toBe(
        expectedBackground,
      )
    })
  })
})
