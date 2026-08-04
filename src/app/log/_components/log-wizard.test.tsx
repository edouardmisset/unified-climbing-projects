import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing'
import type { useUser } from '@clerk/nextjs'
import type { useRouter } from 'next/navigation'
import type { submitClimbingLog } from '../actions'
import LogWizard from './log-wizard'

const mocks = vi.hoisted(() => ({
  refresh: vi.fn<() => void>(),
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

function renderWizard(onUrlUpdate?: OnUrlUpdateFunction) {
  return render(
    <NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate}>
      <LogWizard areas={['Berlin']} locations={['Céüse']} />
    </NuqsTestingAdapter>,
  )
}

describe('log wizard', () => {
  it('moves from common details to repeatable ascents', async () => {
    setupMocks()
    const user = userEvent.setup()
    const queryStrings: string[] = []
    renderWizard(event => {
      queryStrings.push(event.queryString)
    })

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Skip' }))

    expect(screen.getByRole('heading', { name: 'Ascent 1' })).toBeInTheDocument()
    expect(queryStrings).toContain('?step=ascents')
    await user.click(screen.getByRole('button', { name: 'Add ascent' }))
    expect(screen.getByRole('heading', { name: 'Ascent 2' })).toBeInTheDocument()
  })

  it('submits an ascent-only draft through the server action', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard()

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    await user.type(screen.getByLabelText('Name'), 'Berlin')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(mocks.submitClimbingLog).toHaveBeenCalledWith(
      expect.objectContaining({
        ascents: [expect.objectContaining({ name: 'Berlin' })],
        includeTraining: false,
        location: 'Céüse',
      }),
    )
  })

  it('offers training-only and combined continuations', async () => {
    setupMocks()
    const user = userEvent.setup()
    renderWizard()

    await user.click(screen.getByRole('button', { name: 'Training' }))

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('heading', { name: 'Ascent 1' })).toBeInTheDocument()
  })

  it('restores a user-scoped draft and resets it to the original defaults', async () => {
    setupMocks()
    const user = userEvent.setup()
    const firstRender = renderWizard()

    await user.type(screen.getByLabelText('Location'), 'Céüse')
    await waitFor(() => {
      expect(globalThis.localStorage.getItem('climbing-log-draft:v1:test-user')).not.toBeNull()
    })
    firstRender.unmount()

    renderWizard()
    expect(screen.getByLabelText('Location')).toHaveValue('Céüse')

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByLabelText('Location')).toHaveValue('')
    expect(globalThis.localStorage.getItem('climbing-log-draft:v1:test-user')).toBeNull()
  })
})
