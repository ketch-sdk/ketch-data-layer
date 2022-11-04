import { Mapper } from '../mapper'

export default function jsonStructure(value: any): Mapper {
  return JSON.parse(value) as Mapper
}
