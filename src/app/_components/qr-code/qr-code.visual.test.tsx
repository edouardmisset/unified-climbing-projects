import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { groupDataDaysByYear } from '~/data/helpers'
import { sampleAscents, sampleTrainingSessions } from '~/testing/sample-data'
import { AscentsQRCode } from './ascents-qr-code'
import { TrainingQRCode } from './training-qr-code'

const YEAR = 2_026
const yearlyAscents = groupDataDaysByYear(sampleAscents)[YEAR] ?? []
const yearlyTraining = groupDataDaysByYear(sampleTrainingSessions)[YEAR] ?? []

describe('qR code visual regression', () => {
  it('matches the ascent QR code baseline', async () => {
    const screen = await render(
      <div data-testid='visual'>
        <AscentsQRCode yearlyAscents={yearlyAscents} />
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('ascent-qr-code.png')
  })

  it('matches the training QR code baseline', async () => {
    const screen = await render(
      <div data-testid='visual'>
        <TrainingQRCode yearlyTrainingSessions={yearlyTraining} />
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('training-qr-code.png')
  })
})
