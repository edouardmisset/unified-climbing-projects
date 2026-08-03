import { transformLegacyAscent, transformLegacyTrainingSession } from '~/domain/legacy-transformers'
import {
  createAscentFingerprintInput,
  createTrainingSessionFingerprintInput,
} from '~/domain/fingerprint-input'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalAction, internalMutation } from './_generated/server'
import { createContentFingerprint } from './fingerprint'

const tableValidator = v.union(v.literal('ascents'), v.literal('training'))

type MigrationError = { id: string; message: string }
type BatchResult = {
  continueCursor: string
  dwsConversions: number
  errors: MigrationError[]
  isDone: boolean
  migrated: number
  scanned: number
}

export const migrateBatch = internalMutation({
  args: {
    batchSize: v.number(),
    cursor: v.union(v.string(), v.null()),
    dryRun: v.boolean(),
    ownerId: v.string(),
    table: tableValidator,
  },
  handler: async (ctx, args): Promise<BatchResult> => {
    const page = await ctx.db.query(args.table).paginate({
      cursor: args.cursor,
      numItems: args.batchSize,
    })
    const replacements: { id: never; value: Record<string, unknown> }[] = []
    const errors: MigrationError[] = []
    let dwsConversions = 0
    let migrated = 0

    const transformationResults = await Promise.all(
      page.page.map(async (document): Promise<MigrationError | undefined> => {
        try {
          if (
            'ownerId' in document &&
            typeof document.ownerId === 'string' &&
            document.ownerId !== args.ownerId
          )
            throw new Error(`Record is already owned by a different Clerk subject`)

          const transformed =
            args.table === 'ascents'
              ? transformLegacyAscent(document)
              : transformLegacyTrainingSession(document)
          const fingerprintInput =
            args.table === 'ascents'
              ? createAscentFingerprintInput(transformed.value)
              : createTrainingSessionFingerprintInput(transformed.value)
          const contentFingerprint = await createContentFingerprint(fingerprintInput)
          if (args.table === 'ascents' && 'comments' in document && document.comments === 'DWS')
            dwsConversions += 1

          const value = {
            ...transformed.value,
            contentFingerprint,
            ownerId: args.ownerId,
          }
          const isUnchanged =
            transformed.wasCanonical &&
            'contentFingerprint' in document &&
            document.contentFingerprint === contentFingerprint &&
            'ownerId' in document &&
            document.ownerId === args.ownerId

          if (!isUnchanged) {
            migrated += 1
            replacements.push({ id: document._id as never, value })
          }
          return undefined
        } catch (error) {
          return {
            id: document._id,
            message: error instanceof Error ? error.message : String(error),
          }
        }
      }),
    )
    errors.push(
      ...transformationResults.filter((result): result is MigrationError => result !== undefined),
    )

    if (!args.dryRun && errors.length === 0)
      await Promise.all(
        replacements.map(async replacement => {
          await ctx.db.replace(replacement.id, replacement.value as never)
        }),
      )

    return {
      continueCursor: page.continueCursor,
      dwsConversions,
      errors,
      isDone: page.isDone,
      migrated,
      scanned: page.page.length,
    }
  },
})

export const run = internalAction({
  args: {
    batchSize: v.optional(v.number()),
    dryRun: v.boolean(),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    const totals = {
      ascents: { dwsConversions: 0, migrated: 0, scanned: 0 },
      errors: [] as (MigrationError & { table: 'ascents' | 'training' })[],
      training: { migrated: 0, scanned: 0 },
    }

    for (const table of ['ascents', 'training'] as const) {
      // Convex pagination uses null as the initial cursor.
      // eslint-disable-next-line unicorn/no-null
      let cursor: string | null = null
      let isDone = false
      while (!isDone) {
        // Pagination is intentionally sequential: every cursor comes from the prior page.
        // eslint-disable-next-line no-await-in-loop
        const batch: BatchResult = await ctx.runMutation(internal.migrations.migrateBatch, {
          batchSize: args.batchSize ?? 100,
          cursor,
          dryRun: args.dryRun,
          ownerId: args.ownerId,
          table,
        })
        totals[table].migrated += batch.migrated
        totals[table].scanned += batch.scanned
        if (table === 'ascents') totals.ascents.dwsConversions += batch.dwsConversions
        totals.errors.push(...batch.errors.map(error => ({ ...error, table })))
        cursor = batch.continueCursor
        ;({ isDone } = batch)
      }
    }

    if (totals.errors.length > 0)
      throw new Error(`Migration validation failed: ${JSON.stringify(totals.errors)}`)

    return totals
  },
})
