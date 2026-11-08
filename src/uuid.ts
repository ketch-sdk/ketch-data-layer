// Two-character hex string for each byte value, so stringifying a UUID is a lookup rather than padding.
const HEX = Array.from({ length: 256 }, (_, i) => (i + 0x100).toString(16).slice(1))

/**
 * Builds a version 4 UUID from `crypto.getRandomValues` for runtimes without `crypto.randomUUID`.
 */
function fallback(): string {
  const b = new Uint8Array(16)
  crypto.getRandomValues(b)
  // RFC 4122 section 4.4: the high nibble of byte 6 is the version (4 = random)
  b[6] = (b[6] & 0x0f) | 0x40
  // and the top two bits of byte 8 are the variant (10xx = RFC 4122).
  b[8] = (b[8] & 0x3f) | 0x80
  return (
    HEX[b[0]] +
    HEX[b[1]] +
    HEX[b[2]] +
    HEX[b[3]] +
    '-' +
    HEX[b[4]] +
    HEX[b[5]] +
    '-' +
    HEX[b[6]] +
    HEX[b[7]] +
    '-' +
    HEX[b[8]] +
    HEX[b[9]] +
    '-' +
    HEX[b[10]] +
    HEX[b[11]] +
    HEX[b[12]] +
    HEX[b[13]] +
    HEX[b[14]] +
    HEX[b[15]]
  )
}

/**
 * Returns a random (version 4) UUID string.
 */
export function uuidv4(): string {
  return typeof globalThis.crypto?.randomUUID === 'function' ? crypto.randomUUID() : fallback()
}
