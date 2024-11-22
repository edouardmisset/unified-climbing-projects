'use server'

export async function CragSummary({
  cragDuplicates,
  cragFrequency,
  cragSimilar,
  crags,
}: {
  cragDuplicates: Record<string, string[]>[]
  cragFrequency: Record<string, number>
  cragSimilar: [string, string[]][]
  crags: string[]
}) {
  return (
    <div id="crags">
      <h2>
        Crags <sup>{crags.length}</sup>
      </h2>
      <p>{cragDuplicates.length} crags with duplicates</p>
      <p>{cragSimilar.length} crags with similar names</p>
      <p>
        Most climbed crags:{' '}
        {Object.entries(cragFrequency)
          .map(([crag, count]) => [crag, count])
          .sort(([_a, a], [_b, b]) => {
            if (typeof a === 'number' && typeof b === 'number') return b - a
            return 0
          })
          .slice(0, 4)
          .map(([crag, count]) => `${crag} (${count})`)
          ?.join(' - ')}
      </p>
    </div>
  )
}
