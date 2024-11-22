'use server'

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
  return (
    <div id="areas">
      <h2>Areas ({areas.length}):</h2>
      <p>{areaDuplicates.length} areas with duplicates</p>
      <p>{areaSimilar.length} areas with similar names</p>
      <p>
        Most climbed area:{' '}
        {Object.entries(areaFrequency)
          .map(([area, count]) => [area, count])
          .sort(([_a, a], [_b, b]) => {
            if (typeof a === 'number' && typeof b === 'number') return b - a
            return 0
          })[0]
          ?.join(' - ')}{' '}
        climbs
      </p>
    </div>
  )
}
