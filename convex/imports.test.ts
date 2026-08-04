import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import type { AscentPublicInput } from '../src/domain/ascent'
import type { TrainingSessionPublicInput } from '../src/domain/training-session'
import { api } from './_generated/api'
import schema from './schema'
import { modules } from './test.setup'

const USER_A = 'synthetic-clerk-user-a'
const USER_B = 'synthetic-clerk-user-b'
const FRACTIONAL_JOB_TOTAL = 1.5
const EXCESSIVE_JOB_TOTAL = 10_001
const INVALID_JOB_TOTALS = [0, FRACTIONAL_JOB_TOTAL, EXCESSIVE_JOB_TOTAL]

function ascent(name = 'Test Route'): AscentPublicInput {
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

function training(
  type: TrainingSessionPublicInput['type'] = 'Endurance',
): TrainingSessionPublicInput {
  return { date: '2026-08-01', discipline: 'Sport', location: 'Test Gym', type }
}

describe('import job lifecycle', () => {
  test('validates job totals and keeps recent jobs owner-scoped and newest-first', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })

    await Promise.all(
      INVALID_JOB_TOTALS.map(total =>
        expect(asUserA.mutation(api.imports.createJob, { kind: 'ascents', total })).rejects.toThrow(
          'between 1 and 10,000',
        ),
      ),
    )

    const first = await asUserA.mutation(api.imports.createJob, { kind: 'ascents', total: 1 })
    const second = await asUserA.mutation(api.imports.createJob, { kind: 'training', total: 1 })

    const jobs = await asUserA.query(api.imports.listJobs, {})
    expect(jobs.map(job => job._id)).toEqual([second, first])
    expect(await asUserB.query(api.imports.listJobs, {})).toEqual([])
  })

  test('previews existing ascents and training sessions without leaking across owners', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })
    const ascentRow = ascent()
    const trainingRow = training()

    await asUserA.mutation(api.ascents.post, ascentRow)
    await asUserA.mutation(api.training.post, trainingRow)

    expect(await asUserA.query(api.imports.findExistingAscents, { rows: [ascentRow] })).toEqual([
      true,
    ])
    expect(
      await asUserA.query(api.imports.findExistingTrainingSessions, { rows: [trainingRow] }),
    ).toEqual([true])
    expect(await asUserB.query(api.imports.findExistingAscents, { rows: [ascentRow] })).toEqual([
      false,
    ])
    expect(
      await asUserB.query(api.imports.findExistingTrainingSessions, { rows: [trainingRow] }),
    ).toEqual([false])

    const tooManyAscents = Array.from({ length: 101 }, (_, index) => ascent(`Route ${index}`))
    await expect(
      asUserA.query(api.imports.findExistingAscents, { rows: tooManyAscents }),
    ).rejects.toThrow('cannot exceed 100')
  })

  test('skips stored and in-batch ascent duplicates by default', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const existing = ascent('Existing')
    const fresh = ascent('Fresh')
    await asUserA.mutation(api.ascents.post, existing)
    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'ascents', total: 3 })

    const result = await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: [existing, fresh, fresh],
    })

    expect(result).toEqual({ inserted: 1, skipped: 2 })
    await asUserA.mutation(api.imports.finishJob, { failed: false, jobId })
    expect(await asUserA.query(api.ascents.get, {})).toHaveLength(2)
    expect(await asUserA.query(api.imports.listJobs, {})).toEqual([
      expect.objectContaining({ inserted: 1, skipped: 2, status: 'completed' }),
    ])
  })

  test('allows duplicate ascents and training sessions when explicitly requested', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const ascentJobId = await asUserA.mutation(api.imports.createJob, {
      kind: 'ascents',
      total: 2,
    })
    const trainingJobId = await asUserA.mutation(api.imports.createJob, {
      kind: 'training',
      total: 2,
    })

    expect(
      await asUserA.mutation(api.imports.insertAscents, {
        allowDuplicates: true,
        jobId: ascentJobId,
        rows: [ascent(), ascent()],
      }),
    ).toEqual({ inserted: 2, skipped: 0 })
    expect(
      await asUserA.mutation(api.imports.insertTrainingSessions, {
        allowDuplicates: true,
        jobId: trainingJobId,
        rows: [training(), training()],
      }),
    ).toEqual({ inserted: 2, skipped: 0 })
  })

  test('rejects invalid batches, mismatched jobs, ownership, and terminal jobs', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })
    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'ascents', total: 1 })

    await expect(
      asUserA.mutation(api.imports.insertTrainingSessions, {
        allowDuplicates: false,
        jobId,
        rows: [training()],
      }),
    ).rejects.toThrow('does not match training rows')
    await expect(
      asUserB.mutation(api.imports.insertAscents, {
        allowDuplicates: false,
        jobId,
        rows: [ascent()],
      }),
    ).rejects.toThrow('Import job not found')
    await expect(
      asUserA.mutation(api.imports.insertAscents, { allowDuplicates: false, jobId, rows: [] }),
    ).rejects.toThrow('contain 1 to 100')
    await expect(
      asUserA.mutation(api.imports.insertAscents, {
        allowDuplicates: false,
        jobId,
        rows: [ascent(), ascent('Extra')],
      }),
    ).rejects.toThrow('exceeds the declared job size')

    await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: [ascent()],
    })
    await asUserA.mutation(api.imports.finishJob, { failed: false, jobId })
    await expect(
      asUserA.mutation(api.imports.insertAscents, {
        allowDuplicates: false,
        jobId,
        rows: [ascent('Late')],
      }),
    ).rejects.toThrow('not writable')
    await expect(asUserA.mutation(api.imports.finishJob, { failed: false, jobId })).rejects.toThrow(
      'already finished',
    )
  })

  test('does not complete a partial job and can mark it failed', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'training', total: 2 })
    await asUserA.mutation(api.imports.insertTrainingSessions, {
      allowDuplicates: false,
      jobId,
      rows: [training()],
    })

    await expect(asUserA.mutation(api.imports.finishJob, { failed: false, jobId })).rejects.toThrow(
      'before every row is accounted for',
    )
    await asUserA.mutation(api.imports.finishJob, { failed: true, jobId })
    expect(await asUserA.query(api.imports.listJobs, {})).toEqual([
      expect.objectContaining({ status: 'failed' }),
    ])
  })

  test('undoes imported records in bounded batches and reaches an idempotent terminal state', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const rows = Array.from({ length: 101 }, (_, index) => ascent(`Route ${index}`))
    const jobId = await asUserA.mutation(api.imports.createJob, {
      kind: 'ascents',
      total: rows.length,
    })
    await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: rows.slice(0, 100),
    })
    await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: rows.slice(100),
    })
    await asUserA.mutation(api.imports.finishJob, { failed: false, jobId })

    expect(await asUserA.mutation(api.imports.undoBatch, { jobId })).toEqual({
      deleted: 100,
      isDone: false,
    })
    expect(await asUserA.mutation(api.imports.undoBatch, { jobId })).toEqual({
      deleted: 1,
      isDone: true,
    })
    expect(await asUserA.query(api.ascents.get, {})).toEqual([])
    await expect(asUserA.mutation(api.imports.undoBatch, { jobId })).rejects.toThrow(
      'can be undone',
    )
  })

  test('rejects undo for pending jobs', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'training', total: 1 })

    await expect(asUserA.mutation(api.imports.undoBatch, { jobId })).rejects.toThrow(
      'can be undone',
    )
  })
})
