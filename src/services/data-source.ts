export const DATA_SOURCES = ['convex', 'synthetic'] as const

export type DataSource = (typeof DATA_SOURCES)[number]

type DataSourceEnvironment = {
  CLIMBING_DATA_SOURCE?: string
}

export function getDataSource(
  environment: DataSourceEnvironment = {
    CLIMBING_DATA_SOURCE: process.env.CLIMBING_DATA_SOURCE,
  },
): DataSource {
  const dataSource = environment.CLIMBING_DATA_SOURCE ?? 'convex'

  if (dataSource === 'convex' || dataSource === 'synthetic') return dataSource

  throw new Error(
    `Invalid CLIMBING_DATA_SOURCE '${dataSource}'. Expected one of: ${DATA_SOURCES.join(', ')}`,
  )
}

export function assertRemoteWritesEnabled(dataSource = getDataSource()): void {
  if (dataSource === 'convex') return

  throw new Error('Remote writes are disabled while CLIMBING_DATA_SOURCE=synthetic')
}
