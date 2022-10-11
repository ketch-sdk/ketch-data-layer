import { Mapper } from '../types/mapper'

export default async (value: any): Promise<Mapper> => {
  return {
    value,
  }
}
