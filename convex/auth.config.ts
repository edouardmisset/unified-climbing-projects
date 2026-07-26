import type { AuthConfig } from 'convex/server'

const clerkIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN
if (!clerkIssuerDomain) throw new Error('CLERK_JWT_ISSUER_DOMAIN is required')

export default {
  providers: [
    {
      applicationID: 'convex',
      domain: clerkIssuerDomain,
    },
  ],
} satisfies AuthConfig
