import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vite-plus/test'
import type { useRouter } from 'next/navigation'
import type { getAllAscents } from '~/services/ascents'
import type { getRecentImportJobs } from '~/services/imports'
import type { getAllTrainingSessions } from '~/services/training'
import SettingsPage from './page'

vi.mock(import('next/navigation'), () => ({
  useRouter: (() => ({ refresh: vi.fn<() => void>() })) as unknown as typeof useRouter,
}))

vi.mock(import('~/services/ascents'), () => ({
  getAllAscents: vi.fn<typeof getAllAscents>().mockResolvedValue([]),
}))

vi.mock(import('~/services/training'), () => ({
  getAllTrainingSessions: vi.fn<typeof getAllTrainingSessions>().mockResolvedValue([]),
}))

vi.mock(import('~/services/imports'), () => ({
  getRecentImportJobs: vi.fn<typeof getRecentImportJobs>().mockResolvedValue([]),
}))

vi.mock(import('./import-data'), () => ({ ImportData: () => <span hidden /> }) as never)

vi.mock(import('./export-data'), () => ({ ExportData: () => <span hidden /> }) as never)

describe('settingsPage', () => {
  it('contains the Import, Export, and Account sections', () => {
    // eslint-disable-next-line new-cap
    render(SettingsPage())

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Import your data' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Export your data' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Account and deletion' })).toBeInTheDocument()
  })
})
