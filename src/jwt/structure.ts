import type { Mapper } from '../mapper'

/**
 * Decode a JWT segment into the string it represents.
 *
 * JWT segments are encoded with the base64url alphabet, which uses `-` and `_` where base64 uses `+` and `/`, and
 * they carry UTF-8 content. `atob` handles neither, so the alphabet is translated before decoding and the decoded
 * bytes are read back as UTF-8, falling back to the raw bytes when they are not valid UTF-8.
 *
 * @param segment The base64url encoded segment
 */
function decodeSegment(segment: string): string {
  const binary = atob(segment.replace(/-/g, '+').replace(/_/g, '/'))

  try {
    return decodeURIComponent(
      binary
        .split('')
        .map(c => `%${`0${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )
  } catch {
    // else return the decoded bytes as-is
    return binary
  }
}

export default function jwtStructure(value: any, verifierID?: string): Mapper | string {
  const s = value as string

  // If verifierID is present and non-empty, return the raw JWT token for backend validation
  if (verifierID && verifierID.length > 0) {
    return s
  }

  // Otherwise, parse the JWT and return the claims
  const parts = s.split('.')
  const claimsString = parts[1]
  const claims = decodeSegment(claimsString)
  return JSON.parse(claims) as Mapper
}
