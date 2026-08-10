/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from 'next'
import './src/env.js'

const config: NextConfig = {
  headers() {
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
  allowedDevOrigins: ['127.0.0.1'],
  cacheComponents: true,
  experimental: {
    serverActions: {
      // A 5 MiB CSV can more than double as escaped JSON with repeated field names.
      bodySizeLimit: '12mb',
    },
  },
}

export default config
