import { describe, expect, it, vi } from 'vite-plus/test'
import type { AscentImportRow } from '~/domain/ascent'
import type { TrainingSessionImportRow } from '~/domain/training-session'
import { previewCanonicalImport, runCanonicalImport, undoCanonicalImport } from '~/services/imports'
import { previewImport, runImport, undoImport } from './actions'

vi.mock(import('~/services/imports'), () => ({
  previewCanonicalImport: vi.fn<typeof previewCanonicalImport>(),
  runCanonicalImport: vi.fn<typeof runCanonicalImport>(),
  undoCanonicalImport: vi.fn<typeof undoCanonicalImport>(),
}))

const ascentRows = [
  {
    crag: 'Test Crag',
    date: '2026-08-01',
    discipline: 'Sport',
    grade: '7a',
    name: 'Test Route',
    style: 'Redpoint',
    tries: 2,
  },
] satisfies AscentImportRow[]

const trainingRow = { date: '2026-08-01', type: 'Endurance' } satisfies TrainingSessionImportRow
const trainingRows = [trainingRow]

describe('settings import actions', () => {
  it('validates row counts before preview and import', async () => {
    await expect(previewImport('ascents', [])).rejects.toThrow('between 1 and 10000')
    await expect(
      runImport(
        'training',
        Array.from({ length: 10_001 }, () => trainingRow),
        false,
      ),
    ).rejects.toThrow('between 1 and 10000')
  })

  it('delegates valid previews and imports without changing rows', async () => {
    vi.mocked(previewCanonicalImport).mockResolvedValue({
      duplicatesInFile: 0,
      existingMatches: 0,
      total: 1,
    })
    vi.mocked(runCanonicalImport).mockResolvedValue({
      inserted: 1,
      jobId: 'job-id' as never,
      skipped: 0,
    })

    await expect(previewImport('ascents', ascentRows)).resolves.toMatchObject({ total: 1 })
    await expect(runImport('training', trainingRows, true)).resolves.toMatchObject({ inserted: 1 })
    expect(previewCanonicalImport).toHaveBeenCalledWith('ascents', ascentRows)
    expect(runCanonicalImport).toHaveBeenCalledWith('training', trainingRows, true)
  })

  it('rejects invalid duplicate policies and job identifiers', async () => {
    await expect(runImport('ascents', ascentRows, undefined as never)).rejects.toThrow(
      'Invalid duplicate policy',
    )
    await expect(undoImport('')).rejects.toThrow('Invalid import job')
    await expect(undoImport(undefined as never)).rejects.toThrow('Invalid import job')
  })

  it('delegates undo for a valid job identifier', async () => {
    vi.mocked(undoCanonicalImport).mockResolvedValue({ deleted: 2 })

    await expect(undoImport('job-id')).resolves.toStrictEqual({ deleted: 2 })
    expect(undoCanonicalImport).toHaveBeenCalledWith('job-id')
  })
})
