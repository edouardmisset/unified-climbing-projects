import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromGradeToClassName } from '~/helpers/ascent-converter'
import { getHardestAscent } from '~/helpers/filter-ascents'
import { prettyLongDate } from '~/helpers/formatters'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsQRCode } from './ascents-qr-code'

describe('ascentsQrCode', () => {
  it('renders one dot per populated day, colored and labeled by its hardest ascent', async () => {
    const year = new Date(sampleAscents[0]?.date ?? '').getFullYear()
    const yearlyAscents = groupDataDaysByYear(sampleAscents)[year] ?? []
    const populatedDays = yearlyAscents.filter(day => day.length > 0)

    const { container } = await render(<AscentsQRCode yearlyAscents={yearlyAscents} />)

    expect(populatedDays.length).toBeGreaterThan(0)
    await expect.poll(() => container.querySelectorAll('button').length).toBe(populatedDays.length)

    const buttons = [...container.querySelectorAll('button')]
    populatedDays.forEach((day, index) => {
      const button = buttons[index]
      const hintId = button?.getAttribute('interestfor')
      const hardestGradeClass = fromGradeToClassName(getHardestAscent(day)?.grade)
      const expectedLabel = `Ascent on ${prettyLongDate(day[0]?.date ?? '')} - ${day[0]?.crag}`

      expect(button?.getAttribute('aria-label')).toBe(expectedLabel)
      expect(hardestGradeClass === undefined || button?.className.includes(hardestGradeClass)).toBe(
        true,
      )
      if (hintId === null || hintId === undefined) throw new Error('Expected a native hint target')
      expect(container.querySelector(`[id="${hintId}"][popover="hint"]`)).not.toBeNull()
    })
  })
})
