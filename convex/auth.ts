import { ConvexError } from 'convex/values'

type AuthContext = {
  auth: {
    getUserIdentity: () => Promise<{ subject: string } | null>
  }
}

export async function requireIdentity(ctx: AuthContext): Promise<{ subject: string }> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new ConvexError('Unauthenticated')
  return identity
}
