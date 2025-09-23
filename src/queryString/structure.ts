import type { Mapper } from '../mapper'

export default function queryStringStructure(value: any): Mapper {
  const out: Mapper = {}

  // Replace + with %2B to preserve + signs when URLSearchParams decodes
  const sanitizedValue = String(value).replace(/\+/g, '%2B')

  for (const [k, v] of new URLSearchParams(sanitizedValue).entries()) {
    out[k] = v
  }
  return out
}
