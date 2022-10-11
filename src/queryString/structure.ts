import { Mapper } from '../types/mapper'

export default async (value: any): Promise<Mapper> => {
  const out: Mapper = {}
  for (const [k, v] of new URLSearchParams(value).entries()) {
    out[k] = v
  }
  return out
}
