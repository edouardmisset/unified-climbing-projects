type Cache<T> =
  | {
      data: T
      timestamp: number
    }
  | undefined

type CreateCacheOutput<T> = {
  getCache: () => T | undefined
  setCache: (data: T) => void
  clearCache: () => void
}

// Cache expiry duration in milliseconds
const oneHourInMs = 60 * 60 * 1000
const defaultCacheExpiryDurationInMs = oneHourInMs

export function createCache<T>(options?: {
  expiryDurationInMs?: number
}): CreateCacheOutput<T> {
  let cache: Cache<T>

  const { expiryDurationInMs = defaultCacheExpiryDurationInMs } = options ?? {}

  function getCache(): T | undefined {
    if (cache === undefined) return

    const { timestamp, data } = cache

    const isCacheExpired = Date.now() - timestamp >= expiryDurationInMs

    if (isCacheExpired) return

    return data
  }

  function setCache(data: T): void {
    cache = { data, timestamp: Date.now() }
  }

  function clearCache(): void {
    cache = undefined
  }

  return { getCache, setCache, clearCache }
}
