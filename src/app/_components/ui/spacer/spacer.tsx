/**
 *
 * @param size from 0 to 15
 */
// oxlint-disable-next-line no-magic-numbers
function SpacerComponent({ size = 3 }: { size?: number }) {
  const blockSize = {
    blockSize: `var(--size-${size})`,
  }
  return <div style={blockSize} />
}

export const Spacer = SpacerComponent
