import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import type { AscentPublicInput } from '../src/domain/canonical/ascent'
import type { TrainingSessionPublicInput } from '../src/domain/canonical/training-session'
import { api } from './_generated/api'
import schema from './schema'
// The runtime glob excludes tests; Fallow does not model its negative patterns.
// fallow-ignore-next-line circular-dependency
import { modules } from './test.setup'

// These are plain fake Clerk subjects, matching the convention used by
// `src/testing/owner-isolation-matrix.ts`. No real identity or backend is
// involved: `convex-test` runs an in-memory mock of the Convex backend, so
// these tests exercise the real `convex/*.ts` handlers directly instead of
// only asserting properties of a hand-written test-case list.
const USER_A = 'synthetic-clerk-user-a'
const USER_B = 'synthetic-clerk-user-b'

function minimalAscent(overrides: Partial<AscentPublicInput> = {}): AscentPublicInput {
  return {
    crag: 'Test Crag',
    date: '2024-01-15',
    discipline: 'Sport',
    grade: '6a',
    name: 'Test Route',
    style: 'Redpoint',
    tries: 1,
    ...overrides,
  }
}

function minimalTraining(
  overrides: Partial<TrainingSessionPublicInput> = {},
): TrainingSessionPublicInput {
  return {
    date: '2024-01-15',
    type: 'Endurance',
    ...overrides,
  }
}

describe('owner isolation: unauthenticated access', () => {
  test('reads and writes are rejected without an identity', async () => {
    const t = convexTest(schema, modules)

    await expect(t.query(api.ascents.get, {})).rejects.toThrow()
    await expect(t.query(api.training.get, {})).rejects.toThrow()
    await expect(t.query(api.ascents.getById, { id: 'anything' })).rejects.toThrow()
    await expect(t.query(api.training.getById, { id: 'anything' })).rejects.toThrow()
    await expect(t.mutation(api.ascents.post, minimalAscent())).rejects.toThrow()
    await expect(t.mutation(api.training.post, minimalTraining())).rejects.toThrow()
    await expect(t.query(api.diagnostics.ownerCounts, {})).rejects.toThrow()
    await expect(t.mutation(api.imports.createJob, { kind: 'ascents', total: 1 })).rejects.toThrow()
  })
})

describe('owner isolation: ascents and training sessions', () => {
  test('created records are stamped with the acting owner and hidden from other owners', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })

    const ascentId = await asUserA.mutation(api.ascents.post, minimalAscent())
    const trainingId = await asUserA.mutation(api.training.post, minimalTraining())

    expect(await asUserA.query(api.ascents.get, {})).toHaveLength(1)
    expect(await asUserA.query(api.training.get, {})).toHaveLength(1)
    expect(await asUserA.query(api.ascents.getById, { id: ascentId })).toMatchObject({
      crag: 'Test Crag',
    })
    expect(await asUserA.query(api.training.getById, { id: trainingId })).toMatchObject({
      type: 'Endurance',
    })

    expect(await asUserB.query(api.ascents.get, {})).toEqual([])
    expect(await asUserB.query(api.training.get, {})).toEqual([])
    // Convex normalizes an `undefined` query result to `null` over the wire.
    expect(await asUserB.query(api.ascents.getById, { id: ascentId })).toBeNull()
    expect(await asUserB.query(api.training.getById, { id: trainingId })).toBeNull()
  })

  test('per-owner aggregate counts stay scoped', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })

    await asUserA.mutation(api.ascents.post, minimalAscent())
    await asUserA.mutation(api.training.post, minimalTraining())

    expect(await asUserA.query(api.diagnostics.ownerCounts, {})).toMatchObject({
      ascents: 1,
      importJobs: 0,
      training: 1,
    })
    expect(await asUserB.query(api.diagnostics.ownerCounts, {})).toMatchObject({
      ascents: 0,
      importJobs: 0,
      training: 0,
    })
  })
})

describe('owner isolation: CSV imports', () => {
  test('import jobs and duplicate lookups stay scoped to the owning identity', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })

    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'ascents', total: 1 })

    expect(await asUserB.query(api.imports.listJobs, {})).toEqual([])
    await expect(
      asUserB.mutation(api.imports.insertAscents, {
        allowDuplicates: false,
        jobId,
        rows: [minimalAscent()],
      }),
    ).rejects.toThrow('Import job not found')
    await expect(asUserB.mutation(api.imports.undoBatch, { jobId })).rejects.toThrow(
      'Import job not found',
    )

    const row = minimalAscent()
    await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: [row],
    })

    // Same row content, but "have I already imported this?" must never leak
    // across owners: user B has never imported it, regardless of user A's data.
    expect(await asUserA.query(api.imports.findExistingAscents, { rows: [row] })).toEqual([true])
    expect(await asUserB.query(api.imports.findExistingAscents, { rows: [row] })).toEqual([false])
  })

  test('undo only removes the acting owner\u2019s own imported records', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })

    const jobId = await asUserA.mutation(api.imports.createJob, { kind: 'ascents', total: 1 })
    await asUserA.mutation(api.imports.insertAscents, {
      allowDuplicates: false,
      jobId,
      rows: [minimalAscent()],
    })
    await asUserA.mutation(api.imports.finishJob, { failed: false, jobId })
    expect(await asUserA.query(api.ascents.get, {})).toHaveLength(1)

    await asUserA.mutation(api.imports.undoBatch, { jobId })
    expect(await asUserA.query(api.ascents.get, {})).toHaveLength(0)
  })
})
