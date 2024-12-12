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
  const numberOfDuplicateCrags = cragDuplicates.length
  const numberOfSimilarCrags = cragSimilar.length
  const mostClimbedCrag = Object.entries(cragFrequency)
    .map(([crag, count]) => [crag, count])
    .sort(([_a, a], [_b, b]) =>
      typeof a === 'number' && typeof b === 'number' ? b - a : 0,
    )
    .slice(0, 4)
    .map(([crag, count]) => {
      const text = `${count} - ${crag}`
      return <span key={text}>{text}</span>
    })
  return (
    <div id="crags">
      <h2>Crags</h2>
      <p>
        <b>{crags.length}</b> crags visited
      </p>
      {numberOfDuplicateCrags > 0 && (
        <p>{numberOfDuplicateCrags} crags with duplicates</p>
      )}
      {numberOfSimilarCrags > 0 && (
        <p>{numberOfSimilarCrags} crags with similar names</p>
      )}
      <p>Most climbed crags:</p>
      <div className="flex-column">{mostClimbedCrag}</div>
    </div>
  )
}
