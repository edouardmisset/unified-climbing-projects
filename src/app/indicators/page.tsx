import { api } from '~/trpc/server'

async function getIndicators() {
  return await Promise.all(
    [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map(
      async year => {
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
      },
    ),
  )
}

export default async function Page() {
  const indicators = await getIndicators()
  return (
    <div>
      <h1>Indicators</h1>
      {indicators
        .reverse()
        .map(({ year, progression, efficiency, versatility, score }) => (
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
        ))}
    </div>
  )
}
