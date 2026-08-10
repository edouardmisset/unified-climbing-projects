import { AscentDetail } from './ascent-detail'

export async function AscentPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params
  const ascentId = awaitedParams.id
  if (ascentId.length === 0) return <h2>Invalid ascent ID</h2>

  return <AscentDetail ascentId={ascentId} />
}
