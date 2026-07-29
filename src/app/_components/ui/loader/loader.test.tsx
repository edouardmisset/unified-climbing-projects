import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { Loader } from './loader'

describe('loader', () => {
  it('renders an accessible repeated skeleton template', () => {
    const { container } = render(<Loader />)
    const skeleton = container.querySelector('phantom-ui')

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('loading')
    expect(skeleton).toHaveAttribute('count', '4')
    expect(skeleton).toHaveAttribute('loading-label', 'Loading')
  })

  it('renders a single skeleton for compact loading states', () => {
    const { container } = render(<Loader compact />)

    expect(container.querySelector('phantom-ui')).toHaveAttribute('count', '1')
    expect(screen.getByText('Loading content')).toBeInTheDocument()
  })
})
