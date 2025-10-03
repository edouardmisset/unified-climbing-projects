import { createYearList } from '~/data/helpers'
import { api } from '~/trpc/server'
import GridLayout from '../_components/grid-layout/grid-layout'

async function getIndicators() {
  const allAscents = await api.ascents.getAll()
  const years = createYearList(allAscents, {
    continuous: false,
    descending: true,
  })
  return await Promise.all(
    years.map(async year => {
      const results = await Promise.all([
        api.indicators.getProgressionPercentage({ year }),
        api.indicators.getEfficiencyPercentage({ year }),
        api.indicators.getVersatilityPercentage({ year }),
        api.indicators.getScore({ year }),
      ])

      return {
        efficiency: results[1],
        progression: results[0],
        score: results[3],
        versatility: results[2],
        year,
      }
    }),
  )
}

export default async function Page() {
  const indicators = await getIndicators()
  return (
    <GridLayout title="Indicators">
      {indicators.map(
        ({ year, progression, efficiency, versatility, score }) => (
          <div key={year}>
            <h2>{year}</h2>
            <ul>
              <li>Progression: {progression}%</li>
              <li>Efficiency: {efficiency}%</li>
              <li>Versatility: {versatility}%</li>
              <li>
                <strong>Score</strong>: {score}
              </li>
            </ul>
          </div>
        ),
      )}
    </GridLayout>
  )
}
