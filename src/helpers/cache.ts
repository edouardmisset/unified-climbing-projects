export type Cache<T> =
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

// Create cache expiry duration
const oneHourInMs = 60 * 60 * 1000
const defaultCacheExpiryDurationInMs = oneHourInMs

export function createCache<T>(options?: {
  expiryDurationInMs?: number
}): CreateCacheOutput<T> {
  let cache: Cache<T>

  const expiryDuration =
    options?.expiryDurationInMs ?? defaultCacheExpiryDurationInMs

  function getCache(): T | undefined {
    const isCacheValid =
      cache !== undefined && Date.now() - cache.timestamp < expiryDuration

    if (!(cache && isCacheValid)) return

    return cache.data
  }

  function setCache(data: T): void {
    cache = { data, timestamp: Date.now() }
  }

  function clearCache(): void {
    cache = undefined
  }

  return { getCache, setCache, clearCache }
}
