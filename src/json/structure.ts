import type { Mapper } from '../mapper'

export default function jsonStructure(input: any): Mapper {
  const value = JSON.parse(input)
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return value as Mapper
  }
  return { value } as Mapper
}
