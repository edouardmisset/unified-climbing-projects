/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'
// import { RsdoctorWebpackPlugin } from '@rsdoctor/webpack-plugin'

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
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
