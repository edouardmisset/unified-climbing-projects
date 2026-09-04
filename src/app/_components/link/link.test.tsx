import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { describe, expect, it, vi } from 'vitest'
import { Link } from './link'

vi.mock(import('next/navigation'), async importOriginal => ({
  ...(await importOriginal()),
  usePathname: vi.fn<() => string>(),
}))

const usePathnameMock = vi.mocked(usePathname)

describe('link', () => {
  it('preserves active state and click handling for the current route', async () => {
    const handleClick = vi.fn<VoidFunction>()
    usePathnameMock.mockReturnValue('/settings')
    render(
      <Link className='custom' href='/settings' onClick={handleClick}>
        Settings
      </Link>,
    )

    const link = screen.getByRole('link', { name: 'Settings' })
    await userEvent.click(link)

    expect(link).toHaveAttribute('href', '/settings')
    expect(link).toHaveAttribute('data-active', 'true')
    expect(link).toHaveClass('custom')
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
