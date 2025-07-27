import { memo, useMemo } from 'react'

type MarkerPlacement = 'TopLeft' | 'BottomLeft' | 'TopRight'

const markerSize = 8
const numberOfSquareInMarker = 4

const leftRegEx = /left/i
const topRegEx = /top/i

export const Marker = memo(({ placement }: { placement: MarkerPlacement }) => {
  const startingColumn = leftRegEx.test(placement) ? 1 : -1
  const startingRow = topRegEx.test(placement) ? 1 : -1

  const markerIndices = useMemo(
    () => Array.from({ length: numberOfSquareInMarker }, (_, index) => index),
    [],
  )
  return (
    <>
      {markerIndices.map(index => {
        const remainingMarkerSize = markerSize - index

        const rowStart = index <= 1 ? startingRow : startingRow * index
        const columnStart = index <= 1 ? startingColumn : startingColumn * index
        const columnEnd = startingColumn * remainingMarkerSize
        const rowEnd = startingRow * remainingMarkerSize

        const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
        return (
          <span
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
})
