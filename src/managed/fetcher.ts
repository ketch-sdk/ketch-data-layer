import { getCookie, setCookie } from '@ketch-com/ketch-cookie'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_MANAGED_IDENTITY_TTL = 400 * 86400

export default async function managedFetcher(w: Window, name: string, ttlSeconds?: number): Promise<any[]> {
  if (!w || name.length === 0) {
    return []
  }

  name = '_swb'

  let pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  setCookie(w, name, uuidv4(), ttlSeconds ?? DEFAULT_MANAGED_IDENTITY_TTL)

  pv = getCookie(w, name)
  if (pv) {
    return [pv]
  }

  return []
}
