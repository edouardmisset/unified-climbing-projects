import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { KeycapButton } from './keycap-button'

const SUBMIT_REGEX = /submit/i
const CLICK_ME_REGEX = /click me/i
const DISABLED_REGEX = /disabled/i
const KEYBOARD_TEST_REGEX = /keyboard test/i

describe('KeycapButton Component', () => {
  it('renders button with label', () => {
    render(<KeycapButton label="Submit" type="button" />)

    const button = screen.getByRole('button', { name: SUBMIT_REGEX })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Submit')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()

    render(
      <KeycapButton label="Click me" onClick={handleClick} type="button" />,
    )

    const button = screen.getByRole('button', { name: CLICK_ME_REGEX })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<KeycapButton disabled label="Disabled" type="button" />)

    const button = screen.getByRole('button', { name: DISABLED_REGEX })
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

    const button = screen.getByRole('button', { name: KEYBOARD_TEST_REGEX })
    button.focus()
    await userEvent.keyboard('{Enter}')

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
