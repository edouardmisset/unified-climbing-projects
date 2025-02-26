import { memo, useMemo } from 'react'

/**
 *
 * @param size from 0 to 15
 */
function SpacerComponent({ size = 3 }: { size?: number }) {
  const blockSize = useMemo(
    () => ({
      blockSize: `var(--size-${size})`,
    }),
    [size],
  )
  return <div style={blockSize} />
}

export const Spacer = memo(SpacerComponent)
