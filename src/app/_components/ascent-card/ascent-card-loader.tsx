import { getAscentById } from '~/services/ascents'
import { AscentCard } from './ascent-card'

export async function AscentCardLoader({ id }: { id: string }) {
  const ascent = await getAscentById(id)

  if (!ascent) return <p>Ascent not found</p>

  return <AscentCard ascent={ascent} />
}
