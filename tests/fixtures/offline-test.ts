import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

type OfflineNetworkFixture = {
  offlineNetworkGuard: void
}

function isLoopbackRequest(requestUrl: string): boolean {
  const { hostname } = new URL(requestUrl)
  return hostname === '127.0.0.1' || hostname === 'localhost'
}

export const test = base.extend<OfflineNetworkFixture>({
  offlineNetworkGuard: [
    async ({ context }, use) => {
      await context.route('**/*', async (route) => {
        await (isLoopbackRequest(route.request().url())
          ? route.continue()
          : route.abort('blockedbyclient'))
      })

      await use()
    },
    { auto: true },
  ],
})
