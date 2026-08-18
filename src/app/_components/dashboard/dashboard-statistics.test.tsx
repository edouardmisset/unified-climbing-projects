import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { DashboardStatistics } from './dashboard-statistics'

vi.mock(import('next/dynamic'), () => ({
  default: vi.fn<() => () => ReactNode>(() => () => <div>Chart</div>),
}))

describe('dashboardStatistics', () => {
  it('offers recovery actions when filters produce no ascents', () => {
    render(<DashboardStatistics ascents={[]} />)

    expect(screen.getByRole('heading', { name: 'Nothing there...' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'logging new ascents' })).toHaveAttribute(
      'href',
      '/ascents/log',
    )
  })

  it('renders the full chart set for populated ascents', () => {
    render(
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

    expect(screen.getAllByText('Chart')).toHaveLength(10)
  })
})
