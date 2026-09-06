import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing'
import type { useUser } from '@clerk/nextjs'
import type { useRouter } from 'next/navigation'
import type { submitClimbingLog } from '../actions'
import LogWizard from './log-wizard'

const mocks = vi.hoisted(() => ({
  refresh: vi.fn<VoidFunction>(),
  submitClimbingLog: vi.fn<typeof submitClimbingLog>(),
}))

vi.mock(import('next/navigation'), () => ({
  useRouter: (() => ({ refresh: mocks.refresh })) as unknown as typeof useRouter,
}))

vi.mock(import('@clerk/nextjs'), () => ({
  useUser: (() => ({
    isLoaded: true,
    user: { id: 'test-user' },
  })) as unknown as typeof useUser,
}))

vi.mock(import('../actions'), () => ({
  submitClimbingLog: mocks.submitClimbingLog,
}))

function setupMocks() {
  vi.clearAllMocks()
  globalThis.localStorage.clear()
  mocks.submitClimbingLog.mockResolvedValue({
    ascentCount: 1,
    hasTraining: false,
    success: true,
  })
}

function renderWizard(
  onUrlUpdate?: OnUrlUpdateFunction,
  defaultScope?: 'ascents' | 'training' | 'both',
) {
  return render(
    <NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate}>
      <LogWizard
        bootstrap={{
          areas: ['Berlin'],
          crags: ['Céüse'],
          defaultGrade: '7a',
          locations: ['Céüse', 'Arkose'],
          previousSessionTypes: [{ location: 'Arkose', type: 'Power' }],
        }}
        defaultScope={defaultScope}
      />
    </NuqsTestingAdapter>,
  )
}

describe('log wizard', () => {
  it('starts the general logging flow empty and persists added training', async () => {
    setupMocks()
    const user = userEvent.setup()
    const first = renderWizard()
    expect(screen.queryByLabelText('Log contents')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    expect(screen.queryByLabelText('Session type')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add training session' }))
    await user.type(screen.getByLabelText('Comments'), 'Persist me')
    first.unmount()
    renderWizard()
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    expect(screen.getByLabelText('Comments')).toHaveValue('Persist me')
  })

  it.each([
    ['Step 1: General', 'Location'],
    ['Step 3: Ascents', 'Name'],
    ['Step 3: Ascents', 'Area'],
    ['Step 3: Ascents', 'Comments'],
    ['Step 2: Training', 'Comments'],
  ])('clears %s / %s and returns focus without submitting', async (step, label) => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: step }))
    if (step === 'Step 2: Training')
      await user.click(screen.getByRole('button', { name: 'Add training session' }))
    const input = screen.getByLabelText(label)
    expect(screen.queryByRole('button', { name: `Clear ${label}` })).not.toBeInTheDocument()
    await user.type(input, 'Keep editing')
    await user.click(screen.getByRole('button', { name: `Clear ${label}` }))

    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
    expect(screen.queryByRole('button', { name: `Clear ${label}` })).not.toBeInTheDocument()
    expect(mocks.submitClimbingLog).not.toHaveBeenCalled()
    await user.type(input, 'Replacement')
    expect(input).toHaveValue('Replacement')
  })

  it('clears only the selected ascent and keeps required-name validation', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.type(screen.getByLabelText('Name'), 'First route')
    await user.click(screen.getByRole('button', { name: 'Add ascent' }))
    const secondName = screen.getByLabelText('Name', { selector: '[id="ascents.1.name"]' })
    await user.type(secondName, 'Second route')
    secondName.focus()
    await user.tab()
    expect(screen.getAllByRole('button', { name: 'Clear Name' })[1]).toHaveFocus()
    await user.keyboard(' ')

    expect(screen.getAllByLabelText('Name')[0]).toHaveValue('First route')
    expect(screen.getAllByLabelText('Name')[1]).toBeInvalid()
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(mocks.submitClimbingLog).not.toHaveBeenCalled()

    await user.type(secondName, 'Second route')
    await user.click(screen.getByRole('button', { name: 'Remove ascent 1' }))
    const clearButton = screen.getByRole('button', { name: 'Clear Name' })
    clearButton.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Name')).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Step 1: General' }))
    expect(screen.getByLabelText('Location')).toHaveValue('Céüse')
  })

  it('persists cleared text while preserving the rest of the draft', async () => {
    setupMocks()
    const user = userEvent.setup()
    const firstRender = renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.type(screen.getByLabelText('Name'), 'Keep this route')
    await user.click(screen.getByRole('button', { name: 'Step 1: General' }))
    await user.click(screen.getByRole('button', { name: 'Clear Location' }))
    firstRender.unmount()
    renderWizard(undefined, 'ascents')

    expect(screen.getByLabelText('Location')).toHaveValue('')
    expect(screen.queryByRole('button', { name: 'Clear Location' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    expect(screen.getByLabelText('Name')).toHaveValue('Keep this route')
  })

  it('moves from general details to repeatable ascents', async () => {
    setupMocks()
    const user = userEvent.setup()
    const queryStrings: string[] = []
    renderWizard(event => {
      queryStrings.push(event.queryString)
    }, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))

    expect(screen.getByRole('heading', { name: 'Ascent 1' })).toBeInTheDocument()
    expect(queryStrings).toContain('?step=ascents')
    await user.click(screen.getByRole('button', { name: 'Add ascent' }))
    expect(screen.getByRole('heading', { name: 'Ascent 2' })).toBeInTheDocument()
  })

  it('uses the supplied most-frequent grade for new ascents', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))

    expect(screen.getByLabelText('Grade')).toHaveValue('7a')
    expect(screen.getByLabelText('Personal grade')).toHaveValue('7a')
    expect(screen.getByLabelText('Discipline')).toBeRequired()
    expect(screen.getByLabelText('Grade')).toBeRequired()
    expect(screen.getByLabelText('Style')).toBeRequired()
  })

  it('sets and restricts the ascent style to Redpoint after more than 1 try', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.clear(screen.getByLabelText('Tries'))
    await user.type(screen.getByLabelText('Tries'), '2')

    expect(screen.getByLabelText('Style')).toHaveValue('Redpoint')
    expect(screen.getByRole('option', { name: 'Onsight' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'Flash' })).toBeDisabled()
  })

  it('adds from the final ascent card and removes from an ascent card header', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.click(screen.getByRole('button', { name: 'Add ascent' }))
    await user.click(screen.getByRole('button', { name: 'Remove ascent 2' }))

    expect(screen.getByRole('heading', { name: 'Ascent 1' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ascent 2' })).not.toBeInTheDocument()
  })

  it('submits an ascent-only draft through the server action', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.type(screen.getByLabelText('Name'), 'Berlin')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(mocks.submitClimbingLog).toHaveBeenCalledWith(
      expect.objectContaining({
        ascents: [expect.objectContaining({ name: 'Berlin' })],
        location: 'Céüse',
        hasTraining: false,
      }),
    )
  })

  it('adds and removes training without changing ascents', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')
    expect(screen.queryByLabelText('Log contents')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))
    expect(screen.queryByRole('button', { name: 'Add training session' })).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Comments'), 'Training notes')
    await user.click(screen.getByRole('button', { name: 'Remove training session' }))
    expect(screen.queryByLabelText('Session type')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    expect(screen.getByRole('heading', { name: 'Ascent 1' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove ascent 1' }))
    expect(screen.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(mocks.submitClimbingLog).toHaveBeenCalledWith(
      expect.objectContaining({ ascents: [], hasTraining: true }),
    )
  })

  it('does not instantiate an ascent for a training-only log', () => {
    setupMocks()
    renderWizard(undefined, 'training')

    expect(screen.queryByRole('heading', { name: 'Ascent 1' })).not.toBeInTheDocument()
  })

  it('keeps step navigation separate from the selected log contents', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    expect(screen.queryByLabelText('Session type')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()
  })

  it('keeps the optional personal grade mounted when it is cleared', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    const personalGrade = screen.getByLabelText('Personal grade')
    await user.clear(personalGrade)

    expect(screen.getByLabelText('Personal grade')).toHaveValue('')
  })

  it('defaults the training energy system from the general discipline', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.selectOptions(screen.getByLabelText('Discipline'), 'Bouldering')
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))

    expect(screen.getByLabelText('Energy system')).toHaveValue('Anaerobic Alactic')
  })

  it('defaults training to Outdoor when the general location is a crag', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))
    await user.selectOptions(screen.getByLabelText('Session type'), 'Power')
    await user.click(screen.getByRole('button', { name: 'Step 1: General' }))
    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))

    expect(screen.getByLabelText('Session type')).toHaveValue('Outdoor')
  })

  it('defaults training to the latest session type for a non-crag location', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Arkose')
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))

    expect(screen.getByLabelText('Session type')).toHaveValue('Power')
  })

  it('restores a user-scoped draft and resets it to the original defaults', async () => {
    setupMocks()
    const user = userEvent.setup()
    const firstRender = renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await waitFor(() => {
      expect(globalThis.localStorage.getItem('climbing-log-draft:v3:test-user')).not.toBeNull()
    })
    firstRender.unmount()

    renderWizard(undefined, 'ascents')
    expect(screen.getByLabelText('Location')).toHaveValue('Céüse')

    await user.click(screen.getByRole('button', { name: 'Discard draft' }))
    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(screen.getByLabelText('Location')).toHaveValue('')
    expect(globalThis.localStorage.getItem('climbing-log-draft:v3:test-user')).toBeNull()
  })

  it('does not read or migrate drafts from an older storage version', () => {
    setupMocks()
    globalThis.localStorage.setItem(
      'climbing-log-draft:v1:test-user',
      JSON.stringify({ savedAt: Date.now(), values: { location: 'Legacy location' }, version: 1 }),
    )

    renderWizard(undefined, 'ascents')

    expect(screen.getByLabelText('Location')).toHaveValue('')
    expect(globalThis.localStorage.getItem('climbing-log-draft:v3:test-user')).toBeNull()
  })

  it('submits a combined training and ascent draft', async () => {
    setupMocks()
    const user = userEvent.setup()
    mocks.submitClimbingLog.mockResolvedValue({ ascentCount: 1, hasTraining: true, success: true })
    renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 2: Training' }))
    await user.click(screen.getByRole('button', { name: 'Add training session' }))
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.type(screen.getByLabelText('Name'), 'Combined Route')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(mocks.submitClimbingLog.mock.calls[0]?.[0]).toMatchObject({
      ascents: [{ name: 'Combined Route' }],
      location: 'Céüse',
      hasTraining: true,
      training: { type: 'Outdoor' },
    })
    await waitFor(() => {
      expect(mocks.refresh).toHaveBeenCalledWith()
    })
    expect(screen.getByText('General details')).toBeInTheDocument()
  })

  it('keeps the draft visible and reports a rejected server result', async () => {
    setupMocks()
    const user = userEvent.setup()
    mocks.submitClimbingLog.mockResolvedValue({ error: 'Backend unavailable', success: false })
    renderWizard(undefined, 'ascents')

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.type(screen.getByLabelText('Name'), 'Keep Me')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await expect(screen.findByText('Backend unavailable')).resolves.toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Keep Me')
    expect(mocks.refresh).not.toHaveBeenCalled()
  })

  it('does not submit an incomplete ascent', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard(undefined, 'ascents')

    await user.click(screen.getByRole('button', { name: 'Step 3: Ascents' }))
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(mocks.submitClimbingLog).not.toHaveBeenCalled()
  })
})
