import { ConvexError } from 'convex/values'

export function assertWritesEnabled(): void {
  if (process.env.MIGRATION_MAINTENANCE === 'true')
    throw new ConvexError('Writes are temporarily disabled for maintenance')
}
