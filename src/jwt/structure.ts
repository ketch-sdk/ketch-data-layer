import type { Mapper } from '../mapper'

export default function jwtStructure(value: any, verifierID?: string): Mapper | string {
  const s = value as string

  // If verifierID is present and non-empty, return the raw JWT token for backend validation
  if (verifierID && verifierID.length > 0) {
    return s
  }

  // Otherwise, parse the JWT and return the claims
  const parts = s.split('.')
  const claimsString = parts[1]
  const claims = atob(claimsString)
  return JSON.parse(claims) as Mapper
}
