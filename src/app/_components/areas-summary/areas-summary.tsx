export async function AreaSummary({
  areaDuplicates,
  areaFrequency,
  areaSimilar,
  areas,
}: {
  areaDuplicates: Record<string, string[]>[]
  areaFrequency: Record<string, number>
  areaSimilar: [string, string[]][]
  areas: string[]
}) {
  const mostFrequent = await getMostFrequent(areaFrequency)
  const numberOfDuplicateAreas = areaDuplicates.length
  const numberOfSimilarAreas = areaSimilar.length
  return (
    <div id="areas">
      <h2>Areas</h2>
      <p>{areas.length} areas visited</p>
      {numberOfDuplicateAreas > 0 && (
        <p>{numberOfDuplicateAreas} areas with duplicates</p>
      )}
      {numberOfSimilarAreas > 0 && (
        <p>{numberOfSimilarAreas} areas with similar names</p>
      )}
      <p>Most climbed area: {mostFrequent} climbs</p>
    </div>
  )
}

export async function getMostFrequent(areaFrequency: Record<string, number>) {
  return (await transformFrequencyData(areaFrequency))[0]?.join(' - ')
}

export async function transformFrequencyData(
  frequency: Record<string, number>,
  options?: { descending?: boolean },
): Promise<[string, number][]> {
  const { descending = true } = options ?? {}
  return Object.entries(frequency)
    .map(([area, count]) => [area, count])
    .sort(([_a, a], [_b, b]) =>
      typeof a === 'number' && typeof b === 'number'
        ? b - a * (descending ? 1 : -1)
        : 0,
    ) as [string, number][]
}
