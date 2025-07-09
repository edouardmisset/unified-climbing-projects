import NotFound from '~/app/not-found'
import type { Ascent } from '~/schema/ascent'
import type { Timeframe } from '~/schema/generic'
import { api } from '~/trpc/react'
import { AscentList } from '../ascent-list/ascent-list'

export function TopTenTable({
  timeframe,
  initialTopTen,
}: {
  timeframe: Timeframe
  initialTopTen: Ascent[]
}): React.JSX.Element {
  const { data: topTen = initialTopTen } = api.ascents.getTopTen.useQuery({
    timeframe,
  })

  if (topTen === undefined || topTen.length === 0) return <NotFound />

  return <AscentList ascents={topTen} showDetails={false} showPoints={true} />
}
