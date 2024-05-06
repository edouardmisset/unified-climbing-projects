/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js")

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'em-content.zobj.net',
        port: '',
        pathname: '/thumbs/120/apple/354/person-climbing_1f9d7.png',
      },
    ],
  },
}

export default config
