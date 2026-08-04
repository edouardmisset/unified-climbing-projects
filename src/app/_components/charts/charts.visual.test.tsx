import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents, sampleTrainingSessions } from '~/testing/sample-data'
import { AscentPyramid } from './ascents-pyramid/ascent-pyramid'
import { AscentsVolumeAndGradesPerYear } from './ascents-volume-and-grades-per-year/ascents-volume-and-grades-per-year'
import { TrainingSessionsDistribution } from './training-sessions-distribution/training-sessions-distribution'

const VISUAL_STYLE = { height: 520, width: 900 }

describe('chart visual regression', () => {
  it('matches the ascent pyramid baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <AscentPyramid ascents={sampleAscents} />
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('ascent-pyramid.png')
  })

  it('matches the yearly volume and grade baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <AscentsVolumeAndGradesPerYear ascents={sampleAscents} />
      </div>,
    )

    await expect
      .element(screen.getByTestId('visual'))
      .toMatchScreenshot('ascents-volume-and-grades.png')
  })

  it('matches the training distribution baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <TrainingSessionsDistribution trainingSessions={sampleTrainingSessions} />
      </div>,
    )

    await expect
      .element(screen.getByTestId('visual'))
      .toMatchScreenshot('training-distribution.png')
  })
})
