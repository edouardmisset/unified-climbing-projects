const encoder = new TextEncoder()
const HEX_RADIX = 16
const HEX_BYTE_LENGTH = 2

export async function createContentFingerprint(input: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(input))
  return Array.from(new Uint8Array(digest), byte =>
    byte.toString(HEX_RADIX).padStart(HEX_BYTE_LENGTH, '0'),
  ).join('')
}
