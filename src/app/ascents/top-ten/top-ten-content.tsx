import NotFound from '~/app/not-found'
import { createYearList } from '~/data/helpers'
import { getTopTenAscents } from '~/helpers/get-top-ten-ascents'
import { getAllAscents } from '~/services/ascents'
import { YearlyTopTen } from './_components/yearly-top-ten'

export async function TopTenContent() {
  const ascents = await getAllAscents()

  if (ascents.length === 0) return <NotFound />

  return (
    <div className='flex flexColumn gap padding'>
      {createYearList(ascents).map(year => (
        <YearlyTopTen
          ascents={getTopTenAscents({ ascents, timeframe: 'year', year })}
          key={year}
          year={year}
        />
      ))}
    </div>
  )
}
