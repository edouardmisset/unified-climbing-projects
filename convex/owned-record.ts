import type { QueryCtx } from './_generated/server'

type OwnedTable = 'ascents' | 'training'

export async function getOwnedRecord(
  ctx: QueryCtx,
  options: { id: string; ownerId: string; table: OwnedTable },
) {
  const normalizedId = ctx.db.normalizeId(options.table, options.id)
  if (!normalizedId) return
  const record = await ctx.db.get(normalizedId)
  if (!record || record.ownerId !== options.ownerId) return
  return record
}
