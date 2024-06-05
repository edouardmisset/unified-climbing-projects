type MarkerPlacement = 'TopLeft' | 'BottomLeft' | 'TopRight'

const markerSize = 8
const numberOfSquareInMarker = 4

export default function Marker({
  placement,
}: {
  placement: MarkerPlacement
}): JSX.Element {
  const startingColumn = /left/i.test(placement) ? 1 : -1
  const startingRow = /top/i.test(placement) ? 1 : -1

  return (
    <>
      {Array.from({ length: numberOfSquareInMarker })
        .fill(undefined)
        .map((_, i) => {
          const rowStart = i <= 1 ? startingRow : startingRow * i
          const columnStart = i <= 1 ? startingColumn : startingColumn * i
          const columnEnd = startingColumn * (markerSize - i)
          const rowEnd = startingRow * (markerSize - i)
          return (
            <i
              key={i}
              style={{
                backgroundColor:
                  i % 2 === 0 ? 'var(--bg-color)' : 'var(--gray-7)',
                gridArea: `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`,
              }}
            />
          )
        })}
    </>
  )
}
