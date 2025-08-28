/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type { NextConfig } from 'next'
import './src/env.js'
// import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'

const config: NextConfig = {
  experimental: {
    // ppr: true,
    routerBFCache: true,
    useCache: true,
    staleTimes: {
      dynamic: 60,
      static: 5 * 60,
    },
  },
  async redirects() {
    return [
      {
        source: '/visualization',
        destination: '/visualization/ascents/calendar',
        permanent: false,
      },
    ]
  },
  // webpack: config => {
  //   if (config.name === 'client') {
  //     config.plugins.push(
  //       new RsdoctorWebpackPlugin({
  //         disableClientServer: true,
  //       }),
  //     )
  //   } else if (config.name === 'server') {
  //     config.plugins.push(
  //       new RsdoctorWebpackPlugin({
  //         disableClientServer: true,
  //         output: {
  //           reportDir: './.next/server',
  //         },
  //       }),
  //     )
  //   }
  //   return config
  // },
}

export default config
