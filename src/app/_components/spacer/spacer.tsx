/**
 *
 * @param size from 000 to 15
 */
export async function Spacer({ size = 3 }: { size?: number }) {
  return (
    <div
      style={{
        blockSize: `var(--size-${size})`,
      }}
    />
  )
}
