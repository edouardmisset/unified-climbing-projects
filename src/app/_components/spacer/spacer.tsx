import { useMemo } from 'react'

/**
 *
 * @param size from 0 to 15
 */
export function Spacer({ size = 3 }: { size?: number }) {
  const blockSize = useMemo(
    () => ({
      blockSize: `var(--size-${size})`,
    }),
    [size],
  )
  return <div style={blockSize} />
}
