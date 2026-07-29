import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import '~/bones/registry'
import { Loader } from './loader'

describe('loader', () => {
  it('renders an accessible Boneyard page skeleton', () => {
    const { container } = render(<Loader />)
    const skeleton = container.querySelector('[data-boneyard="loading-page"]')

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-busy', 'true')
    expect(skeleton?.querySelector('[data-boneyard-overlay="true"]')).toBeInTheDocument()
  })

  it('selects the compact bones for compact loading states', () => {
    const { container } = render(<Loader compact />)

    expect(container.querySelector('[data-boneyard="loading-compact"]')).toBeInTheDocument()
  })

  it('selects layout-specific bones', () => {
    const { container } = render(<Loader variant='dashboard' />)

    expect(container.querySelector('[data-boneyard="loading-dashboard"]')).toBeInTheDocument()
  })
})
