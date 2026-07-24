import { describe, expect, it } from 'vitest'
import { assertRemoteWritesEnabled, getDataSource } from './data-source'

describe('getDataSource', () => {
  it('uses Convex by default', () => {
    expect(getDataSource({})).toBe('convex')
  })

  it('accepts the synthetic data source', () => {
    expect(getDataSource({ CLIMBING_DATA_SOURCE: 'synthetic' })).toBe('synthetic')
  })

  it('rejects unknown data sources', () => {
    expect(() => getDataSource({ CLIMBING_DATA_SOURCE: 'production' })).toThrow(
      "Invalid CLIMBING_DATA_SOURCE 'production'",
    )
  })
})

describe('assertRemoteWritesEnabled', () => {
  it('allows writes through the Convex data source', () => {
    expect(() => assertRemoteWritesEnabled('convex')).not.toThrow()
  })

  it('blocks writes through the synthetic data source', () => {
    expect(() => assertRemoteWritesEnabled('synthetic')).toThrow(
      'Remote writes are disabled while CLIMBING_DATA_SOURCE=synthetic',
    )
  })
})
