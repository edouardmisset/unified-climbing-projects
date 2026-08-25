import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import type { AnimatedAscent } from './crag-race-timeline'
import { AnimatedAscentPyramid, AnimatedCragRace } from './animated-crag-race'

function renderAnimatedCharts(ascents: AnimatedAscent[]) {
  return render(
    <>
      <AnimatedAscentPyramid ascents={ascents} />
      <AnimatedCragRace ascents={ascents} />
    </>,
  )
}

describe('animatedCragRace', () => {
  it('starts at the latest day and advances through the playback controls', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-03' },
    ])
    const { container } = screen

    await expect.poll(() => container.querySelectorAll('p[aria-live="polite"]').length).toBe(0)
    await expect.poll(() => container.querySelectorAll('h2').length).toBe(0)
    await expect
      .poll(() => {
        const figure = container.querySelector('figure')
        const panel = figure?.querySelector<HTMLElement>('[class*="chartPanel"]')
        if (figure === null || panel === undefined || panel === null) return 0
        return Math.round(
          (panel.getBoundingClientRect().width / figure.getBoundingClientRect().width) * 100,
        )
      })
      .toBe(100)
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(2)
    await expect.poll(() => container.querySelectorAll('.ts-chart__legend').length).toBe(0)
    await expect
      .poll(() =>
        [...container.querySelectorAll<HTMLInputElement>('input[type="range"]')].map(
          input => input.value,
        ),
      )
      .toStrictEqual(['2', '2'])

    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    await expect.poll(() => container.querySelector('[data-controls-active="true"]')).not.toBeNull()
    await screen.getByRole('button', { name: 'Previous day: Crag race' }).click()
    await expect.element(screen.getByText('2024-01-02').first()).toBeInTheDocument()

    await screen.getByRole('button', { name: 'Restart: Crag race' }).click()
    await expect.element(screen.getByText('Day 1 of 3').first()).toBeInTheDocument()

    await screen.getByRole('button', { name: 'Play: Crag race' }).click()
    await expect
      .element(screen.getByRole('button', { name: 'Pause: Crag race' }))
      .toBeInTheDocument()
  })

  it('clears touch controls when the pointer interaction is cancelled', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-02' },
    ])
    const viewport = screen.container.querySelector<HTMLElement>('[class*="chartViewport"]')
    if (viewport === null) throw new Error('Expected chart viewport')

    viewport.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
    await expect
      .poll(() => screen.container.querySelector('[data-controls-active="true"]'))
      .not.toBeNull()

    viewport.dispatchEvent(
      new PointerEvent('pointercancel', { bubbles: true, pointerType: 'touch' }),
    )
    await expect
      .poll(() => screen.container.querySelector('[data-controls-active="true"]'))
      .toBeNull()
  })

  it('keeps each chart total tied to its own timeline cursor', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-03' },
    ])
    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    await screen.getByRole('button', { name: 'Restart: Crag race' }).click()
    await screen.getByRole('button', { name: 'Next day: Crag race' }).click()
    await screen.getByRole('button', { name: 'Next day: Crag race' }).click()
    await screen.getByRole('button', { name: 'Previous day: Ascent pyramid' }).click()

    const charts = screen.container.querySelectorAll('figure')

    await expect
      .poll(
        () => charts[0]?.querySelector<HTMLParagraphElement>('p[aria-live="polite"]')?.textContent,
      )
      .toContain('2 total ascents')
    await expect
      .poll(
        () => charts[1]?.querySelector<HTMLParagraphElement>('p[aria-live="polite"]')?.textContent,
      )
      .toContain('3 total ascents')
  })

  it('updates crag bar geometry as playback advances', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-02' },
    ])
    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    await screen.getByRole('button', { name: 'Restart: Crag race' }).click()

    const [, raceChart] = screen.container.querySelectorAll('figure')
    if (raceChart === undefined) throw new Error('Expected crag race chart')
    const barWidths = () =>
      [...raceChart.querySelectorAll<SVGRectElement>('.ts-chart__bar rect')].map(rect =>
        rect.getAttribute('width'),
      )
    const initialWidths = barWidths()

    await screen.getByRole('combobox', { name: 'Crag race playback speed' }).selectOptions('10')
    await screen.getByRole('button', { name: 'Play: Crag race' }).click()
    await expect.poll(() => barWidths(), { timeout: 4_000 }).not.toStrictEqual(initialWidths)
  })

  it('uses the selected speed while playing', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-03' },
    ])

    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    const speed = screen.getByRole('combobox', { name: 'Crag race playback speed' })
    await speed.selectOptions('10')
    await expect.element(speed).toHaveValue('10')
    await screen.getByRole('button', { name: 'Play: Crag race' }).click()

    await expect
      .poll(() => screen.container.textContent, { timeout: 4_000 })
      .toContain('Day 2 of 3')
  })

  it('applies a speed change made during playback', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const screen = await renderAnimatedCharts([
      { ...sample, _id: 'a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'b', crag: 'Beta', date: '2024-01-01' },
      { ...sample, _id: 'c', crag: 'Alpha', date: '2024-01-03' },
    ])

    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    await screen.getByRole('button', { name: 'Play: Crag race' }).click()
    const speed = screen.getByRole('combobox', { name: 'Crag race playback speed' })
    await speed.selectOptions('10')
    await expect.element(speed).toHaveValue('10')

    await expect
      .poll(() => screen.container.textContent, { timeout: 4_000 })
      .toContain('Day 2 of 3')
  })
})
