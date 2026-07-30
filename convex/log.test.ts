import { convexTest } from 'convex-test'
import { describe, expect, test } from 'vitest'
import type { AscentPublicInput } from '../src/domain/canonical/ascent'
import type { TrainingSessionPublicInput } from '../src/domain/canonical/training-session'
import { api } from './_generated/api'
import schema from './schema'
import { modules } from './test.setup'

const USER_A = 'synthetic-clerk-user-a'
const USER_B = 'synthetic-clerk-user-b'

const ascent = {
  crag: 'Céüse',
  date: '2026-07-30',
  discipline: 'Sport',
  grade: '7a',
  name: 'Berlin',
  style: 'Redpoint',
  tries: 2,
} satisfies AscentPublicInput

const training = {
  date: '2026-07-30',
  discipline: 'Sport',
  location: 'Céüse',
  type: 'Outdoor',
} satisfies TrainingSessionPublicInput

describe('combined climbing log mutation', () => {
  test('requires authentication', async () => {
    const t = convexTest(schema, modules)

    await expect(t.mutation(api.log.post, { ascents: [ascent], training })).rejects.toThrow()
  })

  test('inserts the whole log for the acting owner', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })
    const asUserB = t.withIdentity({ subject: USER_B })

    const result = await asUserA.mutation(api.log.post, {
      ascents: [ascent, { ...ascent, name: 'Blocage Violent' }],
      training,
    })

    expect(result.ascentIds).toHaveLength(2)
    expect(result.trainingId).toBeDefined()
    expect(await asUserA.query(api.ascents.get, {})).toHaveLength(2)
    expect(await asUserA.query(api.training.get, {})).toHaveLength(1)
    expect(await asUserB.query(api.ascents.get, {})).toEqual([])
    expect(await asUserB.query(api.training.get, {})).toEqual([])
  })

  test('accepts ascent-only and training-only logs', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })

    const ascentOnly = await asUserA.mutation(api.log.post, { ascents: [ascent] })
    const trainingOnly = await asUserA.mutation(api.log.post, { ascents: [], training })

    expect(ascentOnly.trainingId).toBeUndefined()
    expect(ascentOnly.ascentIds).toHaveLength(1)
    expect(trainingOnly.trainingId).toBeDefined()
    expect(trainingOnly.ascentIds).toEqual([])
  })

  test('rejects an empty log without writing records', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })

    await expect(asUserA.mutation(api.log.post, { ascents: [] })).rejects.toThrow(
      'A climbing log must contain',
    )
    expect(await asUserA.query(api.ascents.get, {})).toEqual([])
    expect(await asUserA.query(api.training.get, {})).toEqual([])
  })

  test('does not partially write a log when one record is invalid', async () => {
    const t = convexTest(schema, modules)
    const asUserA = t.withIdentity({ subject: USER_A })

    await expect(
      asUserA.mutation(api.log.post, {
        ascents: [ascent, { ...ascent, grade: 'invalid-grade' as never }],
        training,
      }),
    ).rejects.toThrow()
    expect(await asUserA.query(api.ascents.get, {})).toEqual([])
    expect(await asUserA.query(api.training.get, {})).toEqual([])
  })
})
