import { Mapper } from '../mapper'

export default function queryStringStructure(value: any): Mapper {
  const out: Mapper = {}
  for (const [k, v] of new URLSearchParams(value).entries()) {
    out[k] = v
  }
  return out
}
