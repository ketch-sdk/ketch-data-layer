import { Mapper } from '../mapper'

export default function semicolonStructure(value: any): Mapper {
  const values = value.split(';').map((v: string) => v.trim().split('='))
  const out: Mapper = {}
  for (const [k, v] of values) {
    out[decodeURIComponent(k)] = decodeURIComponent(v)
  }
  return out
}
