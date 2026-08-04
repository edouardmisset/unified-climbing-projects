import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { groupDataWeeksByYear } from '~/data/helpers'
import { fromGradeToBackgroundColor } from '~/helpers/ascent-converter'
import { sortByGrade } from '~/helpers/sorter'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsBarcode } from './ascents-barcode'

const HALF = 2

describe('ascentsBarcode', () => {
  it('renders one bar per populated week, sized and colored by its ascents', async () => {
    const year = new Date(sampleAscents[0]?.date ?? '').getFullYear()
    const yearlyAscents = groupDataWeeksByYear(sampleAscents)[year] ?? []
    const populatedWeeks = yearlyAscents.filter(week => week.length > 0)

    const { container } = await render(<AscentsBarcode yearlyAscents={yearlyAscents} />)

    expect(populatedWeeks.length).toBeGreaterThan(0)
    await expect.poll(() => container.querySelectorAll('button').length).toBe(populatedWeeks.length)

    const buttons = [...container.querySelectorAll('button')]
    populatedWeeks.forEach((week, index) => {
      const button = buttons[index]
      const sortedByGrade = week.filter(Boolean).toSorted(sortByGrade)
      const expectedWidth = `${week.length / HALF}%`
      const expectedBackground =
        sortedByGrade.length <= 1
          ? undefined
          : `linear-gradient(to bottom in oklch, ${sortedByGrade
              .map(({ grade }) => fromGradeToBackgroundColor(grade))
              .join(', ')})`

      expect(button?.style.inlineSize).toBe(expectedWidth)
      expect(button?.style.background === '' ? undefined : button?.style.background).toBe(
        expectedBackground,
      )
    })
  })
})
