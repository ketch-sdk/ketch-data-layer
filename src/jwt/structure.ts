import { Mapper } from '../types/mapper'

export default async (value: any): Promise<Mapper> => {
  const s = value as string
  const parts = s.split('.')
  const claimsString = parts[1]
  const claims = Buffer.from(claimsString, 'base64').toString()
  return JSON.parse(claims) as Mapper
}
