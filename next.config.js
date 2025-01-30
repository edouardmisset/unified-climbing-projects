/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
    staleTimes: {
      // in seconds
      dynamic: 5 * 60,
      static: 30 * 60,
    },
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=600, stale-while-revalidate=59',
          },
        ],
      },
    ]
  },
}

export default config
