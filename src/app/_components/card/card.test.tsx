import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './card'

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Test Title</h2>
        <p>Test content</p>
      </Card>,
    )

    expect(screen.getByText(/test title/i)).toBeInTheDocument()
    expect(screen.getByText(/test content/i)).toBeInTheDocument()
  })

  it('applies correct CSS class', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>,
    )

    const cardElement = container.firstChild
    expect(cardElement).toHaveClass(/card/i)
  })

  it('renders with complex children', () => {
    render(
      <Card>
        <header>
          <h1>Header</h1>
        </header>
        <section>
          <p>Section content</p>
        </section>
        <footer>
          <button type="button">Action</button>
        </footer>
      </Card>,
    )

    expect(screen.getByText(/header/i)).toBeInTheDocument()
    expect(screen.getByText(/section content/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
  })
})
