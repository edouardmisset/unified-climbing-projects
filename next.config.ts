/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from 'next'
import './src/env.js'

const config: NextConfig = {
  reactCompiler: { compilationMode: 'infer' },
  experimental: {
    useCache: true,
  },
}

export default config
