import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import type { useRouter } from 'next/navigation'
import type { previewImport, runImport, undoImport } from './actions'
import { ImportWorkspace } from './import-workspace'

const mocks = vi.hoisted(() => ({
  previewImport: vi.fn<typeof previewImport>(),
  refresh: vi.fn<() => void>(),
  runImport: vi.fn<typeof runImport>(),
  undoImport: vi.fn<typeof undoImport>(),
}))

vi.mock(import('next/navigation'), () => ({
  useRouter: (() => ({ refresh: mocks.refresh })) as unknown as typeof useRouter,
}))

vi.mock(import('./actions'), () => ({
  previewImport: mocks.previewImport,
  runImport: mocks.runImport,
  undoImport: mocks.undoImport,
}))

const ascentCsv =
  'discipline,name,grade,crag,date,style,tries\nSport,Example Route,7a,Example Crag,2024-02-29,Onsight,1\n'

const recentJobs = [
  {
    _id: 'job-id',
    inserted: 2,
    kind: 'ascents',
    skipped: 1,
    status: 'completed',
  },
] as never

function setupMocks() {
  vi.clearAllMocks()
  mocks.previewImport.mockResolvedValue({
    duplicatesInFile: 0,
    existingMatches: 1,
    total: 1,
  })
  mocks.runImport.mockResolvedValue({ inserted: 1, jobId: 'job-id' as never, skipped: 0 })
  mocks.undoImport.mockResolvedValue({ deleted: 2 })
}

describe('importWorkspace', () => {
  it('selects a source, previews a file, and confirms duplicate import', async () => {
    setupMocks()
    const user = userEvent.setup()
    render(<ImportWorkspace recentJobs={recentJobs} />)

    const source = screen.getByRole('combobox', { name: 'File type' })
    await user.selectOptions(source, '8a-nu')
    expect(source).toHaveValue('8a-nu')
    await user.selectOptions(source, 'canonical-ascents')

    await user.upload(
      screen.getByLabelText('CSV file'),
      new File([ascentCsv], 'ascents.csv', { type: 'text/csv' }),
    )

    await expect(screen.findByText('Existing exact matches')).resolves.toBeInTheDocument()
    expect(mocks.previewImport).toHaveBeenCalledWith(
      'ascents',
      expect.arrayContaining([expect.objectContaining({ name: 'Example Route' })]),
    )

    await user.click(screen.getByRole('checkbox', { name: 'Import exact duplicates anyway' }))
    await user.click(screen.getByRole('button', { name: 'Import 1 valid rows' }))

    expect(mocks.runImport).toHaveBeenCalledWith(
      'ascents',
      expect.arrayContaining([expect.objectContaining({ name: 'Example Route' })]),
      true,
    )
    await expect(
      screen.findByText('Imported 1 records; skipped 0 duplicates.'),
    ).resolves.toBeInTheDocument()
    expect(mocks.refresh).toHaveBeenCalledWith()
  })

  it('offers undo for a completed import with inserted rows', async () => {
    setupMocks()
    const user = userEvent.setup()
    render(<ImportWorkspace recentJobs={recentJobs} />)

    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(mocks.undoImport).toHaveBeenCalledWith('job-id')
    await expect(
      screen.findByText('Removed 2 records from that import.'),
    ).resolves.toBeInTheDocument()
    expect(mocks.refresh).toHaveBeenCalledWith()
  })
})
