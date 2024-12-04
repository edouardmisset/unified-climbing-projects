'use server'

type MarkerPlacement = 'TopLeft' | 'BottomLeft' | 'TopRight'

const markerSize = 8
const numberOfSquareInMarker = 4

const leftRegEx = /left/i
const topRegEx = /top/i

export default async function Marker({
  placement,
}: {
  placement: MarkerPlacement
}) {
  const startingColumn = leftRegEx.test(placement) ? 1 : -1
  const startingRow = topRegEx.test(placement) ? 1 : -1

  return (
    <>
      {Array.from({ length: numberOfSquareInMarker })
        .fill(undefined)
        .map((_, index) => {
          const rowStart = index <= 1 ? startingRow : startingRow * index
          const columnStart =
            index <= 1 ? startingColumn : startingColumn * index
          const columnEnd = startingColumn * (markerSize - index)
          const rowEnd = startingRow * (markerSize - index)

          const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
          return (
            <i
              key={gridArea}
              style={{
                backgroundColor:
                  index % 2 === 0 ? 'var(--bg-color)' : 'var(--gray-7)',
                gridArea,
              }}
            />
          )
        })}
    </>
  )
}
