import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from './card'

const TEST_TITLE_REGEX = /test title/i
const TEST_CONTENT_REGEX = /test content/i
const CARD_CLASS_REGEX = /card/i
const HEADER_REGEX = /header/i
const SECTION_CONTENT_REGEX = /section content/i
const ACTION_REGEX = /action/i

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <h2>Test Title</h2>
        <p>Test content</p>
      </Card>,
    )

    expect(screen.getByText(TEST_TITLE_REGEX)).toBeInTheDocument()
    expect(screen.getByText(TEST_CONTENT_REGEX)).toBeInTheDocument()
  })

  it('applies correct CSS class', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>,
    )

    const cardElement = container.firstChild
    expect(cardElement).toHaveClass(CARD_CLASS_REGEX)
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

    expect(screen.getByText(HEADER_REGEX)).toBeInTheDocument()
    expect(screen.getByText(SECTION_CONTENT_REGEX)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: ACTION_REGEX }),
    ).toBeInTheDocument()
  })
})
