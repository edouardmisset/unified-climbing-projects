import { describe, expect, it, vi } from 'vitest'
import { syntheticAscents, syntheticTrainingSessions } from '~/data/synthetic-climbing-data'
import {
  toCanonicalAscentRecord,
  toCanonicalTrainingSessionRecord,
} from '~/domain/canonical/legacy-transformers'

const convexMocks = vi.hoisted(() => ({
  fetchMutation: vi.fn<(...arguments_: unknown[]) => Promise<unknown>>(),
  fetchQuery: vi.fn<(...arguments_: unknown[]) => Promise<unknown>>(),
}))

vi.mock(import('convex/nextjs'), () => convexMocks)

async function runInSyntheticMode<T>(task: () => Promise<T>): Promise<T> {
  const originalDataSource = process.env.CLIMBING_DATA_SOURCE
  process.env.CLIMBING_DATA_SOURCE = 'synthetic'
  convexMocks.fetchMutation.mockClear()
  convexMocks.fetchQuery.mockClear()

  try {
    return await task()
  } finally {
    if (originalDataSource === undefined) delete process.env.CLIMBING_DATA_SOURCE
    else process.env.CLIMBING_DATA_SOURCE = originalDataSource
  }
}

describe('convex service in synthetic mode', () => {
  it('returns synthetic ascents without querying Convex', async () => {
    await runInSyntheticMode(async () => {
      const { getAllAscents } = await import('./convex')

      await expect(getAllAscents()).resolves.toStrictEqual(
        syntheticAscents
          .map(toCanonicalAscentRecord)
          .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      )
      expect(convexMocks.fetchQuery).not.toHaveBeenCalled()
    })
  })

  it('returns synthetic training sessions without querying Convex', async () => {
    await runInSyntheticMode(async () => {
      const { getAllTrainingSessions } = await import('./convex')

      await expect(getAllTrainingSessions()).resolves.toStrictEqual(
        syntheticTrainingSessions
          .map(toCanonicalTrainingSessionRecord)
          .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      )
      expect(convexMocks.fetchQuery).not.toHaveBeenCalled()
    })
  })

  it('blocks ascent writes before calling Convex', async () => {
    await runInSyntheticMode(async () => {
      const ascent = syntheticAscents.at(0)
      const { addAscent } = await import('./convex')

      expect(ascent).toBeDefined()
      if (!ascent) return

      await expect(addAscent(ascent)).rejects.toThrow(
        'Remote writes are disabled while CLIMBING_DATA_SOURCE=synthetic',
      )
      expect(convexMocks.fetchMutation).not.toHaveBeenCalled()
    })
  })

  it('blocks training writes before calling Convex', async () => {
    await runInSyntheticMode(async () => {
      const trainingSession = syntheticTrainingSessions.at(0)
      const { addTrainingSession } = await import('./convex')

      expect(trainingSession).toBeDefined()
      if (!trainingSession) return

      await expect(addTrainingSession(trainingSession)).rejects.toThrow(
        'Remote writes are disabled while CLIMBING_DATA_SOURCE=synthetic',
      )
      expect(convexMocks.fetchMutation).not.toHaveBeenCalled()
    })
  })
})
