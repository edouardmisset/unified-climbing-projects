import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { KeycapButton } from './keycap-button'

describe('KeycapButton Component', () => {
  it('renders button with label', () => {
    render(<KeycapButton label="Submit" type="button" />)

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Submit')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()

    render(
      <KeycapButton label="Click me" onClick={handleClick} type="button" />,
    )

    const button = screen.getByRole('button', { name: /click me/i })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<KeycapButton disabled label="Disabled" type="button" />)

    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })

  it('forwards additional props', () => {
    render(
      <KeycapButton
        aria-label="Custom label"
        data-testid="custom-button"
        label="Test"
        type="submit"
      />,
    )

    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('handles keyboard interaction', async () => {
    const handleClick = vi.fn()

    render(
      <KeycapButton
        label="Keyboard test"
        onClick={handleClick}
        type="button"
      />,
    )

    const button = screen.getByRole('button', { name: /keyboard test/i })
    button.focus()
    await userEvent.keyboard('{Enter}')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
