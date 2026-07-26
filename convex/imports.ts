import { ascentPublicInputSchema } from '~/domain/canonical/ascent'
import {
  createAscentFingerprintInput,
  createTrainingSessionFingerprintInput,
} from '~/domain/canonical/fingerprint-input'
import { trainingSessionPublicInputSchema } from '~/domain/canonical/training-session'
import { zodToConvex } from 'convex-helpers/server/zod'
import { ConvexError, v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { type MutationCtx, mutation, query } from './_generated/server'
import { requireIdentity } from './auth'
import { createContentFingerprint } from './fingerprint'
import { assertWritesEnabled } from './maintenance'

const MAX_BATCH_SIZE = 100
const MAX_IMPORT_ROWS = 10_000
const MAX_RECENT_JOBS = 20
const kindValidator = v.union(v.literal('ascents'), v.literal('training'))
const ascentRowsValidator = v.array(zodToConvex(ascentPublicInputSchema))
const trainingRowsValidator = v.array(zodToConvex(trainingSessionPublicInputSchema))

async function requireOwnedJob(ctx: MutationCtx, jobId: Id<'importJobs'>, ownerId: string) {
  const job = await ctx.db.get(jobId)
  if (!job || job.ownerId !== ownerId) throw new ConvexError('Import job not found')
  return job
}

export const createJob = mutation({
  args: { kind: kindValidator, total: v.number() },
  returns: v.id('importJobs'),
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    if (!Number.isInteger(args.total) || args.total < 1 || args.total > MAX_IMPORT_ROWS)
      throw new ConvexError('Import must contain between 1 and 10,000 rows')
    return await ctx.db.insert('importJobs', {
      createdAt: Date.now(),
      inserted: 0,
      kind: args.kind,
      ownerId: subject,
      skipped: 0,
      status: 'pending',
      total: args.total,
    })
  },
})

export const findExistingAscents = query({
  args: { rows: ascentRowsValidator },
  handler: async (ctx, args) => {
    const { subject } = await requireIdentity(ctx)
    if (args.rows.length > MAX_BATCH_SIZE)
      throw new ConvexError(`Preview batches cannot exceed ${MAX_BATCH_SIZE} rows`)
    const fingerprints = await Promise.all(
      args.rows.map(
        async (row) => await createContentFingerprint(createAscentFingerprintInput(row)),
      ),
    )
    return await Promise.all(
      fingerprints.map(async (contentFingerprint) =>
        Boolean(
          await ctx.db
            .query('ascents')
            .withIndex('by_owner_fingerprint', (queryBuilder) =>
              queryBuilder.eq('ownerId', subject).eq('contentFingerprint', contentFingerprint),
            )
            .first(),
        ),
      ),
    )
  },
})

export const findExistingTrainingSessions = query({
  args: { rows: trainingRowsValidator },
  handler: async (ctx, args) => {
    const { subject } = await requireIdentity(ctx)
    if (args.rows.length > MAX_BATCH_SIZE)
      throw new ConvexError(`Preview batches cannot exceed ${MAX_BATCH_SIZE} rows`)
    const fingerprints = await Promise.all(
      args.rows.map(
        async (row) => await createContentFingerprint(createTrainingSessionFingerprintInput(row)),
      ),
    )
    return await Promise.all(
      fingerprints.map(async (contentFingerprint) =>
        Boolean(
          await ctx.db
            .query('training')
            .withIndex('by_owner_fingerprint', (queryBuilder) =>
              queryBuilder.eq('ownerId', subject).eq('contentFingerprint', contentFingerprint),
            )
            .first(),
        ),
      ),
    )
  },
})

export const insertAscents = mutation({
  args: {
    allowDuplicates: v.boolean(),
    jobId: v.id('importJobs'),
    rows: ascentRowsValidator,
  },
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const job = await requireOwnedJob(ctx, args.jobId, subject)
    if (job.kind !== 'ascents') throw new ConvexError('Import job type does not match ascent rows')
    if (job.status !== 'pending' && job.status !== 'running')
      throw new ConvexError('Import job is not writable')
    if (args.rows.length < 1 || args.rows.length > MAX_BATCH_SIZE)
      throw new ConvexError(`Import batches must contain 1 to ${MAX_BATCH_SIZE} rows`)
    if (job.inserted + job.skipped + args.rows.length > job.total)
      throw new ConvexError('Import batch exceeds the declared job size')

    const fingerprints = await Promise.all(
      args.rows.map(
        async (row) => await createContentFingerprint(createAscentFingerprintInput(row)),
      ),
    )
    const seen = new Set<string>()
    let inserted = 0
    let skipped = 0
    const existingRecords = await Promise.all(
      fingerprints.map(
        async (contentFingerprint) =>
          await ctx.db
            .query('ascents')
            .withIndex('by_owner_fingerprint', (queryBuilder) =>
              queryBuilder.eq('ownerId', subject).eq('contentFingerprint', contentFingerprint),
            )
            .first(),
      ),
    )
    const rowsToInsert = []
    for (const [index, row] of args.rows.entries()) {
      const contentFingerprint = fingerprints[index]
      if (contentFingerprint === undefined) throw new ConvexError('Fingerprint generation failed')
      const existing = existingRecords[index]
      if (!args.allowDuplicates && (existing || seen.has(contentFingerprint))) {
        skipped += 1
        continue
      }
      seen.add(contentFingerprint)
      rowsToInsert.push({
        ...row,
        contentFingerprint,
        importJobId: args.jobId,
        ownerId: subject,
      })
      inserted += 1
    }
    await Promise.all(rowsToInsert.map(async (row) => await ctx.db.insert('ascents', row)))
    await ctx.db.patch(args.jobId, {
      inserted: job.inserted + inserted,
      skipped: job.skipped + skipped,
      status: 'running',
    })
    return { inserted, skipped }
  },
})

export const insertTrainingSessions = mutation({
  args: {
    allowDuplicates: v.boolean(),
    jobId: v.id('importJobs'),
    rows: trainingRowsValidator,
  },
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const job = await requireOwnedJob(ctx, args.jobId, subject)
    if (job.kind !== 'training')
      throw new ConvexError('Import job type does not match training rows')
    if (job.status !== 'pending' && job.status !== 'running')
      throw new ConvexError('Import job is not writable')
    if (args.rows.length < 1 || args.rows.length > MAX_BATCH_SIZE)
      throw new ConvexError(`Import batches must contain 1 to ${MAX_BATCH_SIZE} rows`)
    if (job.inserted + job.skipped + args.rows.length > job.total)
      throw new ConvexError('Import batch exceeds the declared job size')

    const fingerprints = await Promise.all(
      args.rows.map(
        async (row) => await createContentFingerprint(createTrainingSessionFingerprintInput(row)),
      ),
    )
    const seen = new Set<string>()
    let inserted = 0
    let skipped = 0
    const existingRecords = await Promise.all(
      fingerprints.map(
        async (contentFingerprint) =>
          await ctx.db
            .query('training')
            .withIndex('by_owner_fingerprint', (queryBuilder) =>
              queryBuilder.eq('ownerId', subject).eq('contentFingerprint', contentFingerprint),
            )
            .first(),
      ),
    )
    const rowsToInsert = []
    for (const [index, row] of args.rows.entries()) {
      const contentFingerprint = fingerprints[index]
      if (contentFingerprint === undefined) throw new ConvexError('Fingerprint generation failed')
      const existing = existingRecords[index]
      if (!args.allowDuplicates && (existing || seen.has(contentFingerprint))) {
        skipped += 1
        continue
      }
      seen.add(contentFingerprint)
      rowsToInsert.push({
        ...row,
        contentFingerprint,
        importJobId: args.jobId,
        ownerId: subject,
      })
      inserted += 1
    }
    await Promise.all(rowsToInsert.map(async (row) => await ctx.db.insert('training', row)))
    await ctx.db.patch(args.jobId, {
      inserted: job.inserted + inserted,
      skipped: job.skipped + skipped,
      status: 'running',
    })
    return { inserted, skipped }
  },
})

export const finishJob = mutation({
  args: { failed: v.boolean(), jobId: v.id('importJobs') },
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const job = await requireOwnedJob(ctx, args.jobId, subject)
    if (job.status !== 'pending' && job.status !== 'running')
      throw new ConvexError('Import job is already finished')
    if (!args.failed && job.inserted + job.skipped !== job.total)
      throw new ConvexError('Import job cannot complete before every row is accounted for')
    await ctx.db.patch(args.jobId, { status: args.failed ? 'failed' : 'completed' })
  },
})

export const undoBatch = mutation({
  args: { jobId: v.id('importJobs') },
  handler: async (ctx, args) => {
    assertWritesEnabled()
    const { subject } = await requireIdentity(ctx)
    const job = await requireOwnedJob(ctx, args.jobId, subject)
    if (!['running', 'undoing', 'completed', 'failed'].includes(job.status))
      throw new ConvexError('Only active, completed, or failed imports can be undone')
    if (job.status !== 'undoing') await ctx.db.patch(args.jobId, { status: 'undoing' })
    const table = job.kind === 'ascents' ? 'ascents' : 'training'
    const records = await ctx.db
      .query(table)
      .withIndex('by_owner_import_job', (queryBuilder) =>
        queryBuilder.eq('ownerId', subject).eq('importJobId', args.jobId),
      )
      .take(MAX_BATCH_SIZE)
    await Promise.all(records.map(async (record) => await ctx.db.delete(record._id)))
    const isDone = records.length < MAX_BATCH_SIZE
    if (isDone) await ctx.db.patch(args.jobId, { status: 'undone' })
    return { deleted: records.length, isDone }
  },
})

export const listJobs = query({
  args: {},
  handler: async (ctx) => {
    const { subject } = await requireIdentity(ctx)
    const jobs = await ctx.db
      .query('importJobs')
      .withIndex('by_owner', (queryBuilder) => queryBuilder.eq('ownerId', subject))
      .order('desc')
      .take(MAX_RECENT_JOBS)
    return jobs.map(({ ownerId: _ownerId, ...job }) => job)
  },
})
