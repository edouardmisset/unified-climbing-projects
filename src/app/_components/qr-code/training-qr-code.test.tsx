import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { QueryProvider } from '~/app/_components/query-provider/query-provider'
import { groupDataDaysByYear } from '~/data/helpers'
import { fromSessionTypeToClassName } from '~/helpers/training-converter'
import { sampleTrainingSessions } from '~/testing/sample-data'
import { TrainingQRCode } from './training-qr-code'

describe('trainingQrCode', () => {
  it('renders one dot per populated day, colored by its session type', async () => {
    const year = new Date(sampleTrainingSessions[0]?.date ?? '').getFullYear()
    const yearlyTrainingSessions = groupDataDaysByYear(sampleTrainingSessions)[year] ?? []
    const populatedDays = yearlyTrainingSessions.filter(day => day.length > 0)

    const { container } = await render(
      <TrainingQRCode yearlyTrainingSessions={yearlyTrainingSessions} />,
      { wrapper: QueryProvider },
    )

    expect(populatedDays.length).toBeGreaterThan(0)
    await expect.poll(() => container.querySelectorAll('button').length).toBe(populatedDays.length)

    const buttons = [...container.querySelectorAll('button')]
    populatedDays.forEach((day, index) => {
      const button = buttons[index]
      const sessionClass = fromSessionTypeToClassName(day[0]?.type)

      expect(sessionClass === undefined || button?.className.includes(sessionClass)).toBe(true)
    })
  })
})
