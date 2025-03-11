import { assert, describe, it, sleep } from 'poku'
import { createCache } from './cache'

describe('createCache', () => {
  it('should set and get cache data', () => {
    const { getCache, setCache } = createCache()
    const testData = 'test data'
    setCache(testData)
    assert.equal(getCache(), testData)
  })

  it('should return undefined if cache is empty', () => {
    const { getCache } = createCache()
    assert.equal(getCache(), undefined)
  })

  it('should clear the cache', () => {
    const { getCache, setCache, clearCache } = createCache()
    const testData = 'test data'
    setCache(testData)
    clearCache()
    assert.equal(getCache(), undefined)
  })

  it('should expire cache after the specified duration', async () => {
    const expiryDurationInMs = 10
    const { getCache, setCache } = createCache({
      expiryDurationInMs,
    })
    const testData = 'test data'
    setCache(testData)

    await sleep(expiryDurationInMs + 50)
    assert.equal(getCache(), undefined)
  })

  it('should not expire cache before the specified duration', async () => {
    const expiryDurationInMs = 10
    const { getCache, setCache } = createCache({
      expiryDurationInMs,
    })
    const testData = 'test data'
    setCache(testData)

    await sleep(expiryDurationInMs / 2)
    assert.equal(getCache(), testData)
  })
})
