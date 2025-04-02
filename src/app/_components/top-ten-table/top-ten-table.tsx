import type { Ascent } from '~/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'

export function TopTenTable({
  topTenAscents,
}: { topTenAscents: Ascent[] }): React.JSX.Element {
  return (
    <AscentList ascents={topTenAscents} showDetails={false} showPoints={true} />
  )
}
