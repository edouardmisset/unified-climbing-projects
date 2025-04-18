import { api } from '~/trpc/server'

export default async function Page() {
  const year = 2023

  const startProgression = Date.now()
  const progression = await api.ascents.getProgressionPercentage({ year })
  const endProgression = Date.now()

  const startEfficiency = Date.now()
  const efficiency = await api.ascents.getEfficiencyPercentage({ year })
  const endEfficiency = Date.now()

  const startVersatility = Date.now()
  const versatility = await api.ascents.getVersatilityPercentage({ year })
  const endVersatility = Date.now()

  return (
    <div>
      <h1>KPI for {year}</h1>
      <ul>
        <li>
          Progression: {progression}% (in{' '}
          {(endProgression - startProgression) / 1000} seconds)
        </li>
        <li>
          Efficiency: {efficiency}% (in{' '}
          {(endEfficiency - startEfficiency) / 1000} seconds)
        </li>
        <li>
          Versatility: {versatility}% (in{' '}
          {(endVersatility - startVersatility) / 1000} seconds)
        </li>
      </ul>
    </div>
  )
}
