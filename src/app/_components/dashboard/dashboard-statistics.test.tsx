import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { DashboardStatistics } from './dashboard-statistics'

describe('dashboardStatistics', () => {
  it('offers recovery actions when filters produce no ascents', async () => {
    const screen = await render(<DashboardStatistics ascents={[]} />)

    await expect
      .element(screen.getByRole('heading', { name: 'Nothing there...' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('link', { name: 'logging new ascents' }))
      .toHaveAttribute('href', '/ascents/log')
  })

  it('renders the interactive chart pair for populated ascents', async () => {
    const screen = await render(
      <DashboardStatistics
        ascents={[
          {
            _id: 'ascent-id',
            crag: 'Céüse',
            date: '2026-08-01',
            discipline: 'Sport',
            grade: '7a',
            name: 'Berlin',
            style: 'Redpoint',
            tries: 2,
          },
        ]}
      />,
    )

    await expect
      .element(screen.getByRole('img', { name: 'Ascent pyramid over time' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('img', { name: 'Ascents by grades per crag over time' }))
      .toBeInTheDocument()
  })

  it('resets the interactive charts when filtered ascents change', async () => {
    const [sample] = sampleAscents
    if (sample === undefined) throw new Error('Expected sample ascent')

    const initialAscents = [
      { ...sample, _id: 'initial-a', crag: 'Alpha', date: '2024-01-01' },
      { ...sample, _id: 'initial-b', crag: 'Beta', date: '2024-01-03' },
    ]
    const filteredAscents = [
      { ...sample, _id: 'filtered-a', crag: 'Alpha', date: '2024-01-02' },
      { ...sample, _id: 'filtered-b', crag: 'Beta', date: '2024-01-04' },
    ]
    const screen = await render(<DashboardStatistics ascents={initialAscents} />)

    await expect.poll(() => screen.container.querySelectorAll('input[type="range"]').length).toBe(2)
    await screen.getByRole('img', { name: 'Ascents by grades per crag over time' }).hover()
    await screen.getByRole('button', { name: 'Previous day: Crag race' }).click()
    await expect
      .poll(() => screen.container.querySelectorAll('p[aria-live="polite"]').length)
      .toBe(1)

    await screen.rerender(<DashboardStatistics ascents={filteredAscents} />)

    await expect
      .poll(() =>
        [...screen.container.querySelectorAll<HTMLInputElement>('input[type="range"]')].map(
          input => input.value,
        ),
      )
      .toStrictEqual(['2', '2'])
    await expect
      .poll(() => screen.container.querySelectorAll('p[aria-live="polite"]').length)
      .toBe(0)
  })
})
