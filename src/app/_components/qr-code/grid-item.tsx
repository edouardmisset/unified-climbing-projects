type GridItemProps = {
  gridArea: string
  index: number
}

function GridItemComponent(props: GridItemProps) {
  const { gridArea, index } = props

  const backgroundStyle = {
    backgroundColor: index % 2 === 0 ? 'var(--bg-color)' : 'var(--gray-7)',
    gridArea,
  }

  return <span style={backgroundStyle} />
}

export const GridItem = GridItemComponent
