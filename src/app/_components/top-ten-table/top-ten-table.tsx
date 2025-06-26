import NotFound from '~/app/not-found'
import type { Ascent } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'

export function TopTenTable({
  topTenAscents,
}: {
  topTenAscents: Ascent[]
}): React.JSX.Element {
  if (topTenAscents.length === 0) return <NotFound />

  return (
    <AscentList ascents={topTenAscents} showDetails={false} showPoints={true} />
  )
}
