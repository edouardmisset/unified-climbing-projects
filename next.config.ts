/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from 'next'
import './src/env.js'

const config: NextConfig = {
  async headers() {
    return [
      {
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), microphone=()',
          },
        ],
        source: '/(.*)',
      },
    ]
  },
  reactCompiler: { compilationMode: 'infer' },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
    useCache: true,
  },
}

export default config
