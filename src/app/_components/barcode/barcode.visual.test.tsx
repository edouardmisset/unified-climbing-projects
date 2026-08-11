import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { QueryProvider } from '~/app/_components/query-provider/query-provider'
import { groupDataDaysByYear } from '~/data/helpers'
import { sampleAscents, sampleTrainingSessions } from '~/testing/sample-data'
import { AscentsBarcode } from './ascents-barcode'
import { TrainingSessionsBarcode } from './training-sessions-barcode'

const YEAR = 2_026
const yearlyAscents = groupDataDaysByYear(sampleAscents)[YEAR] ?? []
const yearlyTraining = groupDataDaysByYear(sampleTrainingSessions)[YEAR] ?? []

describe('barcode visual regression', () => {
  it('matches the ascent barcode baseline', async () => {
    const screen = await render(
      <div data-testid='visual'>
        <AscentsBarcode yearlyAscents={yearlyAscents} />
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('ascent-barcode.png')
  })

  it('matches the training barcode baseline', async () => {
    const screen = await render(
      <div data-testid='visual'>
        <TrainingSessionsBarcode yearlyTraining={yearlyTraining} />
      </div>,
      { wrapper: QueryProvider },
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('training-barcode.png')
  })
})
