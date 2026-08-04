import { describe, expect, it, vi } from 'vite-plus/test'
import type { fetchMutation, fetchQuery } from 'convex/nextjs'
import type { AscentImportRow } from '~/domain/ascent'
import type { TrainingSessionImportRow } from '~/domain/training-session'
import {
  getRecentImportJobs,
  previewCanonicalImport,
  runCanonicalImport,
  undoCanonicalImport,
} from './imports'

const mocks = vi.hoisted(() => ({
  fetchMutation:
    vi.fn<(reference: unknown, args: unknown, options?: unknown) => Promise<unknown>>(),
  fetchQuery: vi.fn<(reference: unknown, args: unknown, options?: unknown) => Promise<unknown>>(),
  getConvexAuthToken: vi.fn<() => Promise<string>>(),
}))

vi.mock(import('server-only'), () => ({}))
vi.mock(
  import('convex/nextjs'),
  () =>
    ({
      fetchMutation: mocks.fetchMutation,
      fetchQuery: mocks.fetchQuery,
    }) as unknown as { fetchMutation: typeof fetchMutation; fetchQuery: typeof fetchQuery },
)
vi.mock(import('./convex'), () => ({ getConvexAuthToken: mocks.getConvexAuthToken }))

function ascent(name: string): AscentImportRow {
  return {
    crag: 'Test Crag',
    date: '2026-08-01',
    discipline: 'Sport',
    grade: '7a',
    name,
    style: 'Redpoint',
    tries: 2,
  }
}

function training(type: TrainingSessionImportRow['type'] = 'Endurance'): TrainingSessionImportRow {
  return { date: '2026-08-01', discipline: 'Sport', location: 'Test Gym', type }
}

function setupMocks(): void {
  vi.clearAllMocks()
  mocks.getConvexAuthToken.mockResolvedValue('test-token')
}

describe('canonical import service', () => {
  it('previews ascent duplicates in sequential batches and counts in-file duplicates', async () => {
    setupMocks()
    const duplicate = ascent('Duplicate')
    const rows = [
      duplicate,
      ...Array.from({ length: 199 }, (_, index) => ascent(`Route ${index}`)),
      duplicate,
    ]
    mocks.fetchQuery
      .mockResolvedValueOnce(Array.from({ length: 100 }, (_, index) => index === 0))
      .mockResolvedValueOnce(Array.from({ length: 100 }, () => false))
      .mockResolvedValueOnce([true])

    await expect(previewCanonicalImport('ascents', rows)).resolves.toStrictEqual({
      duplicatesInFile: 1,
      existingMatches: 2,
      total: 201,
    })

    expect(mocks.fetchQuery).toHaveBeenCalledTimes(3)
    expect(mocks.fetchQuery).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      { rows: rows.slice(0, 100) },
      { token: 'test-token' },
    )
    expect(mocks.fetchQuery).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      { rows: rows.slice(100, 200) },
      { token: 'test-token' },
    )
    expect(mocks.fetchQuery).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      { rows: rows.slice(200) },
      { token: 'test-token' },
    )
  })

  it('uses the training preview endpoint', async () => {
    setupMocks()
    mocks.fetchQuery.mockResolvedValue([false, true])

    await expect(
      previewCanonicalImport('training', [training(), training('Power')]),
    ).resolves.toStrictEqual({ duplicatesInFile: 0, existingMatches: 1, total: 2 })

    expect(mocks.fetchQuery).toHaveBeenCalledWith(
      expect.anything(),
      { rows: [training(), training('Power')] },
      { token: 'test-token' },
    )
  })

  it('imports ascent batches in order and accumulates their results', async () => {
    setupMocks()
    const rows = Array.from({ length: 150 }, (_, index) => ascent(`Route ${index}`))
    mocks.fetchMutation
      .mockResolvedValueOnce('job-id')
      .mockResolvedValueOnce({ inserted: 98, skipped: 2 })
      .mockResolvedValueOnce({ inserted: 49, skipped: 1 })

    await expect(runCanonicalImport('ascents', rows, false)).resolves.toStrictEqual({
      inserted: 147,
      jobId: 'job-id',
      skipped: 3,
    })

    expect(mocks.fetchMutation).toHaveBeenCalledTimes(4)
    expect(mocks.fetchMutation.mock.calls[0]?.[1]).toStrictEqual({ kind: 'ascents', total: 150 })
    expect(mocks.fetchMutation.mock.calls[1]?.[1]).toMatchObject({
      allowDuplicates: false,
      jobId: 'job-id',
      rows: rows.slice(0, 100),
    })
    expect(mocks.fetchMutation.mock.calls[2]?.[1]).toMatchObject({ rows: rows.slice(100) })
    expect(mocks.fetchMutation.mock.calls[3]?.[1]).toStrictEqual({ failed: false, jobId: 'job-id' })
  })

  it('imports training rows with duplicate override enabled', async () => {
    setupMocks()
    const rows = [training(), training('Power')]
    mocks.fetchMutation
      .mockResolvedValueOnce('training-job')
      .mockResolvedValueOnce({ inserted: 2, skipped: 0 })

    await expect(runCanonicalImport('training', rows, true)).resolves.toStrictEqual({
      inserted: 2,
      jobId: 'training-job',
      skipped: 0,
    })
    expect(mocks.fetchMutation.mock.calls[1]?.[1]).toMatchObject({
      allowDuplicates: true,
      jobId: 'training-job',
      rows,
    })
  })

  it('marks a failed job while preserving the original import error', async () => {
    setupMocks()
    const importError = new Error('batch failed')
    mocks.fetchMutation
      .mockResolvedValueOnce('job-id')
      .mockRejectedValueOnce(importError)
      .mockRejectedValueOnce(new Error('status update failed'))

    await expect(runCanonicalImport('ascents', [ascent('Failure')], false)).rejects.toBe(
      importError,
    )
    expect(mocks.fetchMutation.mock.calls[2]?.[1]).toStrictEqual({ failed: true, jobId: 'job-id' })
  })

  it('undoes every backend batch and retrieves recent jobs', async () => {
    setupMocks()
    mocks.fetchMutation
      .mockResolvedValueOnce({ deleted: 100, isDone: false })
      .mockResolvedValueOnce({ deleted: 3, isDone: true })

    await expect(undoCanonicalImport('job-id')).resolves.toStrictEqual({ deleted: 103 })
    expect(mocks.fetchMutation).toHaveBeenCalledTimes(2)

    const jobs = [{ _id: 'job-id', status: 'completed' }]
    mocks.fetchQuery.mockResolvedValue(jobs)
    await expect(getRecentImportJobs()).resolves.toBe(jobs)
    expect(mocks.fetchQuery).toHaveBeenCalledWith(expect.anything(), {}, { token: 'test-token' })
  })
})
