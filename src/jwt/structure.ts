import type { Mapper } from '../mapper'

export default function jwtStructure(value: any): Mapper {
  const s = value as string
  const parts = s.split('.')
  const claimsString = parts[1]
  const claims = Buffer.from(claimsString, 'base64').toString()
  return JSON.parse(claims) as Mapper
}
