import { api } from '~/trpc/server'
import { Card } from '../card/card'
import GridLayout from '../grid-layout/grid-layout'
import { AscentSummary } from './_components/ascent-summary'
import { DaysOutsideSummary } from './_components/days-outside-summary'
import { FavoriteCragSummary } from './_components/favorite-crag-summary'
import { HardestClimbsSummary } from './_components/hardest-climbs-summary'
import { TopTenSummary } from './_components/top-ten-summary'
import { VerticalMilestoneSummary } from './_components/vertical-milestone-summary'
import { ALL_TIME } from './constants'

export default async function WrapUp({ year }: { year?: number }) {
  const ascents = await api.ascents.getAll({ year })

  if (ascents.length === 0) {
    return (
      <GridLayout title={year ?? ALL_TIME}>
        <Card>
          <h2>No Data</h2>
          <p>
            You have not logged any data yet. Go climb some routes and train!
          </p>
        </Card>
      </GridLayout>
    )
  }

  return (
    <GridLayout gridClassName="padding" title={year ?? ALL_TIME}>
      <DaysOutsideSummary ascents={ascents} year={year} />
      <AscentSummary ascents={ascents} />
      <HardestClimbsSummary ascents={ascents} />
      <VerticalMilestoneSummary ascents={ascents} />
      <FavoriteCragSummary ascents={ascents} />
      <TopTenSummary ascents={ascents} />
    </GridLayout>
  )
}
