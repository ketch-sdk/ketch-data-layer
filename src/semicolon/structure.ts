import { Mapper } from '../types/mapper'

export default async (value: any): Promise<Mapper> => {
  const values = value.split(';').map((v: string) => v.trim().split('='))
  const out: Mapper = {}
  for (const [k, v] of values) {
    out[decodeURIComponent(k)] = decodeURIComponent(v)
  }
  return out
}
