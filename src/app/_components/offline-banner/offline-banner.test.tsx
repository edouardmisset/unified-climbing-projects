import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vite-plus/test'
import { OfflineBanner } from './offline-banner'

const { useOfflineMock } = vi.hoisted(() => ({ useOfflineMock: vi.fn<() => boolean>() }))

vi.mock(import('next/offline'), () => ({ useOffline: useOfflineMock }))

describe('offlineBanner', () => {
  it('renders nothing while connected', () => {
    useOfflineMock.mockReturnValue(false)

    render(<OfflineBanner />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('reports that pending requests will retry while offline', () => {
    useOfflineMock.mockReturnValue(true)

    render(<OfflineBanner />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Offline. Pending requests will retry when you reconnect.',
    )
  })
})
