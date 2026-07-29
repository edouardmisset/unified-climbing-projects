import { memo } from 'react'
import { GridItem } from './grid-item'

type MarkerPlacement = 'TopLeft' | 'BottomLeft' | 'TopRight'

const markerSize = 8
const numberOfSquareInMarker = 4
const squareIndices = Array.from({ length: numberOfSquareInMarker }, (_, index) => index)

const leftRegEx = /left/i
const topRegEx = /top/i

export const Marker = memo(({ placement }: { placement: MarkerPlacement }) => {
  const startingColumn = leftRegEx.test(placement) ? 1 : -1
  const startingRow = topRegEx.test(placement) ? 1 : -1

  return (
    <>
      {squareIndices.map(index => {
        const remainingMarkerSize = markerSize - index

        const rowStart = index <= 1 ? startingRow : startingRow * index
        const columnStart = index <= 1 ? startingColumn : startingColumn * index
        const columnEnd = startingColumn * remainingMarkerSize
        const rowEnd = startingRow * remainingMarkerSize

        const gridArea = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`
        return <GridItem gridArea={gridArea} index={index} key={gridArea} />
      })}
    </>
  )
})
